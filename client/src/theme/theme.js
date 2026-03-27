import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF9800', // Orange
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2196F3', // Blue
      light: '#64B5F6',
      dark: '#1976D2',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#F44336', // Red
      light: '#EF5350',
      dark: '#D32F2F',
      contrastText: '#eeeeee',
    },
    background: {
      default: '#eeeeee', // White background
      paper: '#FAFAFA',
    },
    text: {
      primary: '#212121', // Dark grey for text
      secondary: '#757575', // Medium grey
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      color: '#212121',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#212121',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#212121',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FF9800',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
        containedPrimary: {
          backgroundColor: '#FF9800',
          '&:hover': {
            backgroundColor: '#F57C00',
          },
        },
        containedSecondary: {
          backgroundColor: '#2196F3',
          '&:hover': {
            backgroundColor: '#1976D2',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F5F5F5',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#F5F5F5',
          color: '#212121',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;