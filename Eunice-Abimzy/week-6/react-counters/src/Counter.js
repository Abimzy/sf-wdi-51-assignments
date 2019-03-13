import React, { Component } from 'react';

 class Counter extends Component {
  state = {
    counterValue: 0
  };
  
  decreaseCount = () => {
    let count = this.state.counterValue - 1;

    this.setState({
      count
    })
  }

  increaseCount = () => {
    let count = this.state.counterValue + 1;

    this.setState({
      count 
    })
  }

  render() {
    return (
      <div>
        <h2>Counter:{this.state.counterValue}</h2>
        <button onClick={this.decreaseCount}>Decrement</button> <button onClick={this.increaseCount}>Increment</button>
      </div>
    )
  }
}
export default Counter

