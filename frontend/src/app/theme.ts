import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  shape: { borderRadius: 8 },
  palette: {
    primary: { main: '#d84127' },
    secondary: { main: '#e8ae3b' },
    success: { main: '#37845a' },
  },
  typography: {
    fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
    h1: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 700 },
    h2: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 700 },
    h3: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 6, textTransform: 'none', fontWeight: 700 },
      },
    },
  },
})