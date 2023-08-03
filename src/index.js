import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import '~/lib/interceptor';
import React from 'react';
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
// import App from './App';
import store from '~/redux';
import { Wrapper } from './Wrapper';

ReactDOM.render((
    <Provider store={store}>
        <BrowserRouter>
            <Wrapper />
        </BrowserRouter>
    </Provider>
), document.getElementById('root'));
