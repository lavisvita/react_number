let nextTodoId = 0;
const ADD_TODO ='ADD_TODO';
const COMPLETE_TODO ='COMPLETE_TODO';
const DELETE_TODO = 'DELETE_TODO';

export function addTodo(text){
    return{
        type: ADD_TODO,
        text: text
        }
    }

export function completeTodo(id){
    return {
        type: COMPLETE_TODO,
        id: id
        }
    }

export function deleteTodo(id){
    return {
        type: DELETE_TODO,
        id: id
    }
}
