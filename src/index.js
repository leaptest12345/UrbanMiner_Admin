import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'react-jss';
import Theme from 'resources/theme';
import Routes from 'routes';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import store from 'Redux/store';

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={Theme}>
        <Router>
            <Routes />
        </Router>
    </ThemeProvider>
    </Provider>,
    document.getElementById('root')
);
serviceWorker.unregister();
