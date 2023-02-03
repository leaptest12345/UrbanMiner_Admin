import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'react-jss';
import Theme from 'resources/theme';
import Routes from 'routes';
import './index.css';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <ThemeProvider theme={Theme}>
        <Router basename={process.env.PUBLIC_URL}>
            <Routes />
        </Router>
    </ThemeProvider>,
    document.getElementById('root')
);
serviceWorker.unregister();
