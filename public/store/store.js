import { applyMiddleware, compose, createStore } from 'redux';
import reducer from '../reducers/reducers';
import logger from 'redux-logger';
let finalCreateStore = compose(
    applyMiddleware(logger())
)(createStore);

export default function configStore(initialState = { todos: [] }){
    return finalCreateStore(reducer, initialState)
}