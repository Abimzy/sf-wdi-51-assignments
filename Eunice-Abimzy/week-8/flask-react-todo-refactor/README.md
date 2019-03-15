# Flask-React Todo

## Learning Objectives
- Build a backend in Flask retrofitting the routes used in React todo app with full CRUD.
- Checkout the `react-front-end` given in this repo to get the React frontend or you can even use your own code. Don't be afraid to get creative. 
- Objective is to build the backend API in Flask for this React app. (AKA your own TODO api!)
    - Model should include 
        - body: String,
        - priority: Number,
        - completed: Boolean
    - Feeling creative? Why not CRUD some pokemon? Pick a crudable resource and get to practicing! 
- You will have to update the routes in the React app to point to APIs created in Flask backend.

Models => Todo.js

```diff
import axios from 'axios'

-const url = `https://super-crud-api.herokuapp.com/api/todos`
+const url = `YOUR LOCAL HOST`

class TodoModel {
  static all = () =>{
    let request = axios.get(`${url}`)
    return request
  }
```