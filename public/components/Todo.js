import React, { Component } from 'react';
import ReactDom from 'react-dom';

export default class Todo extends Component {
    render() {
        return (
            <div>
                {this.props.text}
            </div>
        )
    }
}


