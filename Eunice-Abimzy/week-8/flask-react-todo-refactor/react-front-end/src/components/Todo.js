import React, {Component} from 'react'
import TodoForm from './TodoForm'
class Todo extends Component {
  
  constructor() {
    super();
    this.state = {
      completed : Boolean(),
      formStyle : {display: 'none'},
      bodyStyle : {},
    }

  }
  
  componentDidMount(){
    this.setState({
      completed: this.props.todo.completed
    })
  }

  toggleBodyForm = () => {
    (this.state.formStyle.display === 'block')?
      this.setState({formStyle: {display: 'none'}, bodyStyle: {display:'block'} })
    :
      this.setState({formStyle: {display:'block'}, bodyStyle: {display: 'none'}})
    
  }

  deleteClickedTodo = () => this.props.onDeleteTodo(this.props.todo)

  handleCheck = () => {
    this.setState({
      completed: !this.state.completed
    })
    this.props.markComplete(this.props.todo._id, {completed: !this.state.completed})
  }


  render(){
    return(
      <li 
        data-todos-index={this.props.todo.id}
        >
        <div style={this.state.bodyStyle}>
          <input 
            type="checkbox" 
            checked={Boolean(this.state.completed)} 
            onChange={this.handleCheck} />
          <span 
            className= { this.state.completed ? "completed item" : "item" }>
            {this.props.todo.body}</span>
          <a
            className='edit' 
            onClick={this.toggleBodyForm}>
            edit
          </a>
          <a
            className='remove'
            onClick={this.deleteClickedTodo}>
            Remove
          </a>
        </div>
        <TodoForm
          todo={this.props.todo}
          style={this.state.formStyle}
          autoFocus={true}
          buttonName="Save"
          onUpdateTodo={this.props.onUpdateTodo} 
          toggleBodyForm={this.toggleBodyForm}/>
      </li> 
    )
  }
}

export default Todo