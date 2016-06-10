let nextTodoId = 0;
export function addTodo(text){
    return{
        type: 'ADD_TODO',
        todos: {
            id: nextTodoId++,
            isDone: false,
            text: text
        }

    }
}

export function toggleTodo(id){
    return {
        type: 'TOGGLE_TODO',
        todos: id
    }
}