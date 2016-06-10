import React from "react";
import ReactDOM from "react-dom";
import {Provider} from 'react-redux';
import App from './components/app';

import todoApp from './reducers/reducers';
import { createStore } from 'redux';
import { Router, Route, browserHistory, IndexRoute, hashHistory, Link } from "react-router";

const app = document.getElementById('app');
let store = createStore(todoApp);
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    app);
