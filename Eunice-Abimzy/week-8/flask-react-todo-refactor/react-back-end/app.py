import os

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)
CORS(app)

# Set Base Directory
basedir = os.path.abspath(os.path.dirname(__file__))

# Setup Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.reacttodo')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Init Database
db = SQLAlchemy(app)

#Init Marshmallow
marshmallow = Marshmallow(app)

DEBUG = True 
PORT = 8000

@app.route('/todos', methods=['GET', 'POST'])
@app.route('/todos/<todoid>', methods=['GET', 'PUT', 'DELETE'])
def get_or_create_or_delete_todo(todoid=None):
    from models import Todo
    if todoid == None and request.method =='GET':
        return Todo.get_todos()
    elif todoid == None:
        body = request.json['body'] 
        priority = request.json['priority']
        completed = request.json['completed']
        return Todo.create_todo(body, priority, completed)  #POST method or create todo happens here
    elif todoid and request.method == 'DELETE':
        return Todo.delete_todo(todoid)
    else:
        return Todo.get_todo(todoid)

@app.route('/todos/<todoid>', methods=['PUT'])
def update(todoid):
    from models import Todo
    body = request.json['body']
    priority = request.json['priority']
    completed = request.json['completed']
    return Todo.update_todo(todoid, body, priority, completed)



if __name__ == '__main__':
    app.run(debug=DEBUG, port=PORT)

