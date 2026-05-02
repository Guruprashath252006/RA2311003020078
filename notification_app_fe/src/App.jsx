import React, { useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Box, Typography, AppBar, Toolbar } from '@mui/material';
import NotificationFeed from './components/NotificationFeed';
import './index.css';

function App() {
  const theme = useMemo(() => createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#3b82f6',
      },
      background: {
        default: '#0f172a',
        paper: '#1e293b',
      },
    },
    typography: {
      fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  }), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Container maxWidth="md">
            <Toolbar disableGutters sx={{ height: 80 }}>
              <Box>
                <Typography variant="h5" component="div" sx={{ 
                  fontWeight: 800, 
                  background: 'linear-gradient(45deg, #3b82f6 30%, #a855f7 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Campus Hub
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>
                  Real-time Priority Feed
                </Typography>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        <Container maxWidth="md" sx={{ flexGrow: 1, py: 4 }}>
          <NotificationFeed />
        </Container>

        <Box component="footer" sx={{ py: 3, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Campus Hub Microservices
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;