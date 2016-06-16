import React, { Component, PropTypes } from 'react';
import { addTodo } from '../actions/actions';

export default class TodoInput extends Component{
    handleClick(e){
        e.preventDefault();
        const node = this.refs.addTodoField;
        const text = node.value.trim();
        this.props.dispatch(addTodo(text));
        node.value = '';
    }
    render(){
        return(
            <div>
                <form>
                <input type='text' ref='addTodoField' />
                <input type='submit' value="add task" onClick={::this.handleClick} />

                </form>
            </div>
        )
    }
}