let authToken = null;

export const setAuthToken = (token) => {
    authToken = token;
};

export const Log = async (stack, level, pkg, message) => {
    try {
        let token = authToken;
        if (!token) {
            if (typeof process !== 'undefined' && process.env && process.env.ACCESS_TOKEN) {
                token = process.env.ACCESS_TOKEN;
            }
        }
        
        const url = 'http://20.207.122.201/evaluation-service/logs';
        const payload = {
            stack,
            level,
            message
        };

        if (stack === 'backend') {
            payload.package = pkg;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(errorText);
        }
    } catch (error) {
        console.error(error);
    }
};
