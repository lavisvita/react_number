import React, { Component, PropTypes } from 'react';
import Todo from './Todo';
import TodoInput from './TodoInput';
export default class TodoList extends Component{

    render(){

        return(
            <div>
                <TodoInput dispatch={this.props.dispatch} />

                {this.props.todos.map(todo=><Todo dispatch={this.props.dispatch} id={todo.id} key={todo.id} text={todo.text} />)}
            </div>
        )
    }
}