import React, { Component } from 'react';
import TodoModel from '../models/Todo'; 
import Todos from '../components/Todos';
import CreateTodoForm from '../components/CreateTodoForm';


class TodosContainer extends Component  {
  state = {
      todos: []
    }
  //WHen TodosContainer mounts, fetch todo data  
  componentDidMount(){
    this.fetchData()
  }

  //Fetch all todos from super-crud-api
  fetchData(){
    TodoModel.all().then((res) => {
    this.setState ({
      todos: res.data.todos,
      todo: ''
    })
  })
}

//Provide a function to create new todos
createTodo = (todo) => {
  let newTodo = {
    body: todo,
    completed: false
  }
TodoModel.create(newTodo).then((res) => {
    let todos = this.state.todos;
    let newTodos = todos.push((res.data));
    this.setState({ newTodos });
  })
}
 //Provide function to update todo
  //Will need to initiate a pre-filled form containing specific data
  updateTodo = (todoId, todoBody) => {
    function isUpdatedTodo(todo) {
      return todo._id === todoId;
    }
    TodoModel.update(todoId, todoBody).then((res) => {
      let todos = this.state.todos
      todos.find(isUpdatedTodo).body = todoBody.body
      todos.find(todo => isUpdatedTodo(todo)).body = res.data.body;
      this.setState({todos: todos})
    })
  }
  //Provide function to delete a todo on successful response. 
  //After delete response is sent back from server,find corresponding entry without same _id
  //for todo in todos state array and remove it
deleteTodo = (todo) => {
TodoModel.delete(todo).then((res) => {
  let todos = this.state.todos.filter(function(todo) {
    return todo._id !== res.data._id
  });
  this.setState({todos})
    })
  }
render(){
   return (
      <div className="todosComponent">
        <CreateTodoForm createTodo={this.createTodo}/>
          <Todos 
          todos={ this.state.todos }
          updateTodo={ this.updateTodo }
          deleteTodo={ this.deleteTodo }/>
      </div>
    )
  }
}
export default TodosContainer

