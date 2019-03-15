import React, {Component} from 'react'
import TodoModel from '../models/Todo'
import Todos from '../components/Todos'
import TodoDashboard from '../components/TodoDashboard'
import CreateTodoForm from '../components/CreateTodoForm'

class TodosContainer extends Component {
  constructor(){
    super()
    this.state = {
      todos: [],
      editingTodoId: null,
      editing: false,
      todoCount: 0
    }
  }
  
  componentDidMount(){
    this.fetchData()
  }

  fetchData = () => {
    TodoModel.all().then( (res) => {
      this.setState ({
        todos: res.data.todos,
        todo: '',
        todoCount:res.data.todos.filter(todo => todo.completed === false).length
      })
    })
  }

  createTodo = (todo) => {
    let newTodo = {
        body: todo,
        completed: false
    }
    TodoModel.create(newTodo).then((res) => {
        let todos = this.state.todos
        let newTodos = todos.push(res.data)
        this.setState({newTodos})

    })
  }

  updateTodo = (todoBody, todoId) => {
    function isUpdatedTodo(todo) {
        return todo._id === todoId;
    }
    TodoModel.update(todoId, todoBody).then((res) => {
        let todos = this.state.todos
        todos.find(isUpdatedTodo).body = todoBody.body
        this.setState({todos: todos})
    })
  }


  deleteTodo = (todo) => {
    TodoModel.delete(todo).then((res) => {
        let todos = this.state.todos.filter(function(todo) {
          return todo._id !== res.data._id
        });
        this.setState({todos})
    })
  }

  markComplete = (todoId, complete) => {
    console.log(complete)
    function isUpdatedTodo(todo) {
      return todo._id === todoId;
    } 
    let todos = this.state.todos;
    todos.find(isUpdatedTodo).complete = complete
    this.setState({
      todos: todos
    })
    TodoModel.update( todoId, complete ).then((res) => {
      if(complete.completed){
        this.setState({
          todoCount: this.state.todoCount - 1
        })
      } else {
        this.setState({
          todoCount: this.state.todoCount + 1
        })
      }
      return res.data.completed
    })
  }

  clearCompleted = () => {
    console.log("CLEAR!")
    
    let filteredTodos = this.state.todos
      .filter( todo => {
        console.log("in filter")
        if(todo.completed === true ){
          console.log("bye!")
          TodoModel.delete(todo)
        }
          return true
        
      })
      this.setState({
        todos: filteredTodos
      })

  }
  
  render(){
    return (
      <div className='todosComponent'>
        <CreateTodoForm
          createTodo={ this.createTodo }
          />
        <Todos
          todos={this.state.todos}
          onDeleteTodo={this.deleteTodo} 
          onUpdateTodo={this.updateTodo} 
          markComplete={this.markComplete}
          />
        <TodoDashboard 
          todoCount={this.state.todoCount} />

      </div>
    )
  }
}

export default TodosContainer