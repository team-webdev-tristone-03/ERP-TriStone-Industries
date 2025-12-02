import { createTheme } from '@mui/material/styles';

export const createAppTheme = (isDarkMode) => createTheme({
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.025em'
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.025em'
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.02em'
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.02em'
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em'
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em'
    },
    body1: {
      fontWeight: 400,
      letterSpacing: '-0.01em'
    },
    body2: {
      fontWeight: 400,
      letterSpacing: '-0.01em'
    },
    button: {
      fontWeight: 500,
      letterSpacing: '0.02em'
    },
    caption: {
      fontWeight: 400,
      letterSpacing: '0.02em'
    },
    overline: {
      fontWeight: 500,
      letterSpacing: '0.08em'
    }
  },
  palette: {
    mode: isDarkMode ? 'dark' : 'light',
    primary: {
      main: '#3B86D1',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#844FC1',
      contrastText: '#FFFFFF'
    },
    success: {
      main: '#38CE3C',
      contrastText: '#FFFFFF'
    },
    error: {
      main: '#FF4D6B',
      contrastText: '#FFFFFF'
    },
    warning: {
      main: '#FF9800',
      contrastText: '#FFFFFF'
    },
    info: {
      main: '#8E32E9',
      contrastText: '#FFFFFF'
    },
    background: {
      default: isDarkMode ? '#121212' : '#F8F9FA',
      paper: isDarkMode ? '#1E1E1E' : '#FFFFFF'
    },
    text: {
      primary: isDarkMode ? '#FFFFFF' : '#2C2C2C',
      secondary: isDarkMode ? '#B3B3B3' : '#6C7293'
    },
    divider: isDarkMode ? '#333333' : '#E0E0E0'
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#3B86D1',
          color: '#FFFFFF'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
          borderRight: `1px solid ${isDarkMode ? '#333333' : '#F8F9FA'}`
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#844FC1',
            color: '#FFFFFF',
            '& .MuiListItemIcon-root': {
              color: '#FFFFFF'
            },
            '&:hover': {
              backgroundColor: '#844FC1'
            }
          },
          '&:hover': {
            backgroundColor: '#F8F9FA'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
          boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#3B86D1',
          '&:hover': {
            backgroundColor: '#2E6BA8'
          }
        },
        containedSecondary: {
          backgroundColor: '#844FC1',
          '&:hover': {
            backgroundColor: '#6B3F9A'
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#3B86D1',
          color: '#FFFFFF'
        },
        colorSecondary: {
          backgroundColor: '#844FC1',
          color: '#FFFFFF'
        },
        colorSuccess: {
          backgroundColor: '#38CE3C',
          color: '#FFFFFF'
        },
        colorError: {
          backgroundColor: '#FF4D6B',
          color: '#FFFFFF'
        },
        colorInfo: {
          backgroundColor: '#8E32E9',
          color: '#FFFFFF'
        }
      }
    }
  }
});

const theme = createAppTheme(false); // Default light theme
export default theme;