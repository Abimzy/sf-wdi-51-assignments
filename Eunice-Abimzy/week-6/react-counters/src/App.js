import React, { Component } from 'react';
import Header from './Header';
import CounterList from './CounterList';

 class App extends Component {
  state = {
    counters:this.props.counter
   }

   increaseCounters = () => {
    let counters = this.state.counter + 1;
   }
   increaseCounters = () => {
    let counters = this.state.counter - 1;
  }

  render() {
    return (
      <div>
        <Header />
        <div><CounterList counter={this.state.counters}/></div>
      </div>
    )
  }
}
export default App