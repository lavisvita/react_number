import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addTodo, toggleTodo } from '../actions/actions';
import TodoList from './TodoList';
class App extends Component{
    render(){
        const todos = this.props.todos;
        const addTodo = this.props.addTodo;
        const toggleTodo = this.props.toggleTodo;
        console.log(todos);
        return(
            <div>
                <TodoList todos={todos}
                          addTodo={addTodo}
                          toggleTodo={toggleTodo}
                         />
            </div>
        )
    }
}

function showTodos(state) {
    return {
        todos: state.showTodos
    }
}
function changeIsDone(dispatch){
    return {
        addTodo: text => dispatch(addTodo(text)),
        toggleTodo: id => dispatch(toggleTodo(id))
    }
}

export default connect(showTodos, changeIsDone)(App);