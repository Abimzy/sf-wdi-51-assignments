import React, {Component} from 'react'
import Todo from './Todo'

class Todos extends Component {



  render(){
    let todos = this.props.todos.map( (todo) => {
      return (
        <Todo
          key={todo._id}
          todo={todo}
          onDeleteTodo={this.props.onDeleteTodo}
          onUpdateTodo={this.props.onUpdateTodo} 
          markComplete={this.props.markComplete}
          />
      )
    })
    return(
      <ul>
        {todos}
      </ul>
    )
  }
}

export default Todos