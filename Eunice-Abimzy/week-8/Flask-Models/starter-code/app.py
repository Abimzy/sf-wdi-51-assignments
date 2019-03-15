from flask import Flask, g
from flask import render_template, flash, redirect, url_for
from forms import SubForm
#This makes connection to the models
import models


DEBUG = True
PORT = 8000

app = Flask(__name__)
app.secret_key = 'adkjfalj.adflja.dfnasdf.asd'

# Handle requests when they come in (before) and when they complete (after)
@app.before_request
def before_request():
#Connect to the DB before each request.
    g.db = models.DATABASE
    g.db.connect()

@app.after_request
def after_request(response):
#Close the database connection after each request.
    g.db.close()
    return response

# The root route will revert back to a simpler version that just returns some text
@app.route('/')
def index():

 # the form variable we send down to the template needs to be added here
    form = SubForm()
    return render_template('new_sub.html', title='New Sub', form=form)


# @app.route('/r')
# @app.route('/r/<sub>')
# def r(sub=None):
#     with open('subs.json') as json_data:
#         subs = json.load(json_data)
#         if sub == None:
#             return render_template('subs.html', subs=subs)
#         else:
#             sub_id = int(sub)
#             return render_template('sub.html', sub=subs[sub_id])


# @app.route('/posts')
# @app.route('/posts/<id>')
# def posts(id=None):
#     with open('posts.json') as json_data:
#         posts = json.load(json_data)
#         if id == None:
#             return render_template('posts.html', posts=posts)
#         else:
#             post_id = int(id)
#             return render_template('post.html', post=posts[post_id])

if __name__ == '__main__':
# before our app runs we initialize a connection to the models
    # models.initialize()
    app.run(debug=DEBUG, port=PORT)
