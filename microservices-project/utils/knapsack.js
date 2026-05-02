function knapsack(tasks, capacity) {
    if (!tasks || tasks.length === 0 || capacity <= 0) {
        return 0;
    }

    const n = tasks.length;
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        const { Duration, Impact } = tasks[i - 1];
        
        if (!Duration || !Impact) {
            for (let w = 0; w <= capacity; w++) {
                dp[i][w] = dp[i - 1][w];
            }
            continue;
        }

        for (let w = 0; w <= capacity; w++) {
            if (Duration <= w) {
                dp[i][w] = Math.max(
                    Impact + dp[i - 1][w - Duration],
                    dp[i - 1][w]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    return dp[n][capacity];
}

module.exports = knapsack;
