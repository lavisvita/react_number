import React from "react";
import ReactDOM from "react-dom";
import {Provider} from 'react-redux';
import App from './components/app';

import configStore from './store/store';

import { Router, Route, browserHistory, IndexRoute, hashHistory, Link } from "react-router";

let initialState = {
    todos: [{
        id: 0,
        isDone: false,
        text: 'example'
    }]
};

let store = configStore(initialState);

const app = document.getElementById('app');

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    app);
