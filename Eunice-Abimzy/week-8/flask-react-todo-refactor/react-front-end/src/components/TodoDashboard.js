import React, {Component} from 'react'

class TodoDashboard extends Component {
  render(){
      return (
        <div className="count-wrapper">
          <p>You have <span className="count">{this.props.todoCount} todos</span> left to complete.</p>
        </div>
      )
    }
}

export default TodoDashboard


