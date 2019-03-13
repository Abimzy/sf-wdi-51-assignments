// Developer TODO: Define App component defintion here
import React, { Component } from 'react'
import './App.css'
import NavBar from './NavBar';
import Header from './Header';
import Search from './Search';

 class App extends Component {
  render() {
    return (
      <div>
          <NavBar />
          <Header />
          <Search />
      </div>
    )
  }
}
export default App