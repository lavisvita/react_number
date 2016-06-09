import React from 'react';
import ReactDom from 'react-dom';
import { connect } from 'react-redux';
class App extends React.Component{
    render(){
        console.log(this.props);
        const {dispatch} = this.props;
        return(
            <div>

                <h1>States testing</h1>
                <button onClick = { () => {dispatch({type: 'INCREASE_COUNTER'}) }}>
                    Increase
                </button>
                <span>{this.props.counter}</span>
            </div>
        )
    }
}
function select(state){
    return {counter: state.counter};
}
export default connect(select)(App);