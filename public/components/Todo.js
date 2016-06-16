import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { deleteTodo, completeTodo } from '../actions/actions';
export default class Todo extends Component {
    handleComplete(){
        this.props.dispatch(completeTodo(this.props.id))
    }
    handleDelete(){
        this.props.dispatch(deleteTodo(this.props.id))
    }
    render() {
        return (
            <div>
                <span onClick={::this.handleComplete}>{this.props.text}</span>
                <a onClick={::this.handleDelete}>X</a>
            </div>
        )
    }
}


