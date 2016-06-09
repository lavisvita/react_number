import React from "react";
import ReactDOM from "react-dom";
import {Provider} from 'react-redux';
import App from './components/app';

import store from './reducers/reducers';

import { Router, Route, browserHistory, IndexRoute, hashHistory, Link } from "react-router";

const app = document.getElementById('app');

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    app);
