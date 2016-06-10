import React, { Component, PropTypes } from 'react';
import Todo from './Todo';

export default class TodoList extends Component{

    render(){
        return(
            <div>
                <input type='text' ref='addTodoField' />
                <button onClick={::this.handleClick}>
                    Add todo
                </button>
                {this.props.todos.map(todo =>
                    <Todo key={todo.id} text={todo.text} onClick={this.props.toggleTodo(todo.id)}/>
                )}
            </div>
        )
    }
    handleClick(e){
        const node = this.refs.addTodoField;
        const text = node.value.trim();
        this.props.addTodo(text);
        node.value = '';
    }
}