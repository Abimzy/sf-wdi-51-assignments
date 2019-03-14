from flask import Flask, g
from flask import render_template, flash, redirect, url_for

from forms import SubForm, PostForm
import models

DEBUG = True
PORT = 8000

app = Flask(__name__)
app.secret_key = 'adkjfalj.adflja.dfnasdf.asd'

# Handle requests when the come in (before) and when they complete (after)
@app.before_request
def before_request():
  """Connect to the DB before each request."""
  g.db = models.DATABASE
  g.db.connect()

@app.after_request
def after_request(response):
  """Close the database connection after each request."""
  g.db.close()
  return response


@app.route('/', methods=['GET', 'POST'])
def index():
  form = SubForm()
  if form.validate_on_submit():
    models.Sub.create(name=form.name.data.strip(), description=form.description.data.strip())

    flash("New sub registered. Called: {}".format(form.name.data))
    return redirect('/r')
  return render_template('new_sub.html', title="New Sub", form=form)


@app.route('/r')
@app.route('/r/<sub>', methods=['GET', 'POST'])
def r(sub=None):
  if sub == None:
    subs = models.Sub.select().limit(100)
    return render_template("subs.html", subs=subs)
  else:
    # Find the right Sub
    sub_id = int(sub)
    sub = models.Sub.get(models.Sub.id == sub_id)
    posts = sub.posts
    
    # Define the form for Posts
    form = PostForm()
    if form.validate_on_submit():
      models.Post.create(
        user=form.user.data.strip(),
        title=form.title.data.strip(), 
        text=form.text.data.strip(), 
        sub=sub)

      flash("New post created")
      return redirect("/r/{}".format(sub_id))
    return render_template("sub.html", sub=sub, posts=posts, form=form)


@app.route('/posts')
@app.route('/posts/<id>')
def posts(id=None):
    if id == None:
      posts = models.Post.select().limit(100)
      return render_template('posts.html', posts=posts)
    else:
      post_id = int(id)
      post = models.Post.get(models.Post.id == post_id)
      return render_template('post.html', post=post)


if __name__ == '__main__':
  models.initialize()
  app.run(debug=DEBUG, port=PORT)
