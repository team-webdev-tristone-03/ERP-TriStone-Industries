import { createTheme } from '@mui/material/styles';

const theme = createTheme({
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
    primary: {
      main: '#3B86D1', // Blue - Top bar, main nav, active tab
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#844FC1', // Purple - Selected state, badges
      contrastText: '#FFFFFF'
    },
    success: {
      main: '#38CE3C', // Bright Green - Success alerts, paid fees
      contrastText: '#FFFFFF'
    },
    error: {
      main: '#FF4D6B', // Fiery Rose - Errors, warnings, overdue
      contrastText: '#FFFFFF'
    },
    warning: {
      main: '#FF4D6B', // Fiery Rose - Warnings
      contrastText: '#FFFFFF'
    },
    info: {
      main: '#8E32E9', // Electric Purple - Info badges, tooltips
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#F8F9FA', // Light Gray - Main background
      paper: '#FFFFFF' // White - Cards, modals
    },
    text: {
      primary: '#6C7293', // Soft Gray - Primary text
      secondary: '#6C7293' // Soft Gray - Secondary text
    },
    grey: {
      100: '#F8F9FA',
      200: '#6C7293',
      300: '#6C7293',
      400: '#6C7293',
      500: '#6C7293'
    }
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
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #F8F9FA'
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
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
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

export default theme;