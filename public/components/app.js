import React, { Component } from 'react';
import { connect } from 'react-redux';
import TodoList from './TodoList';

class App extends Component{
    render(){
        const todos = this.props.todos;
        const addTodo = this.props.addTodo;
        const toggleTodo = this.props.toggleTodo;
        return(
            <div>
                <TodoList dispatch={this.props.dispatch} todos={todos}  />
            </div>
        )
    }
}

function mapStateToProps(state){
    return state;
}
export default connect(mapStateToProps)(App);