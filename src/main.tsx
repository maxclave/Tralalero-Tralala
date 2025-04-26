import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import './index.css';

if (typeof window !== 'undefined') {
	window.addEventListener('error', (event) => {
		if (event?.message?.includes('ResizeObserver') || event?.error?.message?.includes('ResizeObserver')) {
			event.stopImmediatePropagation();
			console.warn('ResizeObserver error suppressed');
			return false;
		}
	}, true);
}

const theme = createTheme({
	palette: {
		primary: {
			main: '#1976d2',
		},
	},
	components: {
		MuiPaper: {
			styleOverrides: {
				root: {
					userSelect: 'none',
				}
			}
		}
	}
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<ThemeProvider theme={theme}>
		<CssBaseline/>
		<App/>
	</ThemeProvider>
);