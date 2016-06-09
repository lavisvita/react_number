import { createStore } from 'redux';

function reducer(state, action){
    switch(action.type){
        case 'INCREASE_COUNTER':
            return {...state, ...{counter: state.counter+1}}
        default:
            return state;
    }
}

const store = createStore(reducer, {
    counter: 0
});

export default store;