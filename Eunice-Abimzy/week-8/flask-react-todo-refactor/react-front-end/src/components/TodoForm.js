import React, {Component} from 'react'

class TodoForm extends Component {
  constructor() {
    super();
    this.state = {
      todo: ''
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange(event) {
    this.setState({
      todo: event.target.value
    })
  }

  onSubmit(event){
    event.preventDefault()
    this.props.toggleBodyForm()
    var todo = this.state.todo
    console.log({body: todo})
    this.props.onUpdateTodo({body: todo}, this.props.todo._id)
  
  }

  componentDidMount(){
    this.setState({
      todo: this.props.todo.body
    })
  }
  render(){
    return (
      <div style={this.props.style} className='todoForm'>
        <form className="editor" onSubmit={ this.onSubmit }>
          <input
            autoFocus={this.props.autoFocus}
            onChange={ this.onChange } 
            type='text'
            value={(this.state && this.state.todo) || ''} />
          <button type='submit' className="btn">{this.props.buttonName}</button>
        </form>
      </div>
    )
  }
}
export default TodoForm