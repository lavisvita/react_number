import { List, Map } from 'immutable';
import action from '../actions/actions';
import { combineReducers } from 'redux';

export function addTodo(state, action){
    switch(action.type){
        case 'ADD_TODO':
            return action.todos;
        default:
            return state;
    }
}

export function showTodos(state=[], action){
    switch(action.type){
        case 'ADD_TODO':
            return [
                ...state,
                addTodo(undefined,action)
            ];
        default:
            return state;
    }
}

const todoApp = combineReducers({
    showTodos
});

export default todoApp;