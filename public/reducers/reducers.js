function getId(state){
    return state.todos.reduce((maxId,todo)=>{
            return Math.max(todo.id, maxId)
        }, -1) + 1
}
export default function reducers(state, action){
    switch(action.type){
        case 'ADD_TODO':
            return Object.assign({}, state, {
                todos: [{
                    text: action.text,
                    isDone: false,
                    id: getId(state)
                }, ...state.todos]
            })
        case 'COMPLETE_TODO':
            return Object.assign({}, state, {
            todos: state.todos.map((todo)=>{
                return (todo.id === action.id) ?
                    Object.assign({}, todo, { isDone: !todo.isDone }) : todo;
            })
        })
        case 'DELETE_TODO':
            return Object.assign({}, state, {
                todos: state.todos.filter((todo)=>{
                    return todo.id !== action.id
                })
            })
        default:
            return state;
    }
}
