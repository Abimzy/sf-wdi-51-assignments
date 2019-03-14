# Flask Models
This lesson on building models in Flask comes hot off the heels of our Flask Templates lesson. The starter code in this repo is where you should have left off in the last lesson and that's where we're going to start today.

Clone down this repo, and navigate to the `starter-code` directory in your file structure.

### Learning Objectives:
Students will be able to:
- build models in Flask with a new ORM, `peewee`
- associate models together
- include forms in frontend templates with `WTForms`
- cleaning up and refactoring a Flask application

## Overview
At the beginning of this lesson, our reddit clone uses JSON in place of a proper database to pass down data to templates. Our primary focus is replacing our JSON references with models, a database, and frontend functionality to create instances of those models.

We'll build out all the functionality for Subs and Posts together and then you'll build out the Comment model on your own as an opportunity to practice these things.

### TODO List
- We do: Build out a model for subs
  - set up the model
  - set up the routes and functions for creating a new sub
  - build out a front end for new sub forms

- We do: Build out a model for posts
  - set up the model for posts
  - relate posts to subs
  - set up the routes and functions for creating a new post
  - build out a front end for new posts and associated forms

- You do: build the model and appropriate templates for comments
  - model
  - relate comments to posts
  - build routes and functions for creating comments
  - provide a form for creating comments


## Steps for Subs:
1. Create a new `models.py` file in the project root
```python
  import datetime
  # peewee is a small and simple ORM, like mongoose but simpler
  from peewee import *

  # We use the built in SqliteDatabase() function from peewee 
  # to save a reference to a DB file to a DATABASE variable
  DATABASE = SqliteDatabase('breddit.db')

  # Our Sub model is pretty simple, just a name and description for now
  class Sub(Model):
    name = CharField()
    description = TextField()

  # We initialize a connection to the DATABASE, create a table for the Sub model, 
  # and close the connection
  def initialize():
    DATABASE.connect()
    DATABASE.create_tables([Sub], safe=True)
    DATABASE.close()
```

2. Our `app.py` file has a lot of useful functionality but we need to add a connection to our newly implemented Sub model. We also need to manage connections to our database manually and finally initialize the models when our app starts up.
```python
  # ...
  
  # This gains access to our models
  import models

  # ...

  # Handle requests when the come in (before) and when they complete (after)
  @app.before_request
  def before_request():
    """Connect to the DB before each request."""
    g.db = models.DATABASE
    g.db.connect()

  @app.after_request
  def after_request():
    """Close the database connection after each request."""
    g.db.close()
    return response


  # The root route will revert back to a simpler version that just returns some text
  @app.route('/')
  def index():
    return 'Integrating models with this route'

  # ...
  if __name__ == '__main__':
    # before our app runs we initialize a connection to the models
    models.initialize()
    app.run(debug=DEBUG, port=PORT)
```

3. The Sub model exists and is connected to our app but we're not doing anything with it. Let's give ourselves a way to create new subs. Enter WTForms.
  - add a `forms.py` file to the project
  - `forms.py` defines a class to represent our form. We add the fields we need which will eventually be used with a form builder on the frontend, a fairly common feature of frameworks like Flask, Django, Ruby on Rails, etc.
```python
  # import the tools and fields we need
  from flask_wtf import FlaskForm as Form
  from wtforms import TextField, TextAreaField, SubmitField

  # import the Sub model
  from models import Sub

  # create the class and variables to house Field definitions
  class SubForm(Form):
    name = TextField("Name this sub")
    description = TextAreaField("Add a description for the sub here")
    submit = SubmitField('Create Sub')
```

4. Our SubForm exists but we can't use it until we add it to a template.
  - create a `new_sub.html` template
  - use the form builder to render the form (if you're silently yelling about how we don't know what the `{{ form.something() }}` is, you're on the right track and we'll get there in the next step)
```python
  {% extends "layout.html" %}

  {% block content %}
    <form method="POST" action="" novalidate>
      {{ form.hidden_tag() }}

      <div>
        {{ form.name.label }}
        {{ form.name() }}
      </div>
      <div>
        {{ form.description.label }}
        {{ form.description() }}
      </div>

      {{ form.submit() }}
    </form>
  {% endblock %}
```

5. With a form on the frontend and a model in back, we're ready to put the two together.
  - add a function to our exisitng root route that sends down a reference to the form
```python
  # ...
  from forms import SubForm
  # ...

  @app.route('/')
  def index():
    # the form variable we send down to the template needs to be added here
    form = SubForm()
    return render_template("new_sub.html", title="New Sub", form=form)
```
- check that our form renders at the root route. If it doesn't, time to debug. When it does, write a commit.
- what happens when you try to submit the form?

6. Up to this point our root route has been receiving and accepting one type of HTTP request: "GET". If our form is going to work we need to modify so that "POST" requests are accepted too.
- allow the root route to accept multiple methods
```python
  # ...
  @app.route('/', methods=['GET', 'POST'])
  def index():
    # the form variable we send down to the template needs to be added here
    form = SubForm()
    return render_template("new_sub.html", title="New Sub", form=form)
```

7. Now let's handle that POST request:
```python
  @app.route('/', methods=['GET', 'POST'])
  def index():
    form = SubForm()
    # checks if the form submission is valid
    if form.validate_on_submit():
      # if it is, we create a new Sub
      models.Sub.create(name=form.name.data.strip(), description=form.description.data.strip())

      flash("New sub registered. Called: {}".format(form.name.data))
      # and redirect to the main Sub index
      return redirect('/r')
      
    # if the submission isn't valid, send the user back to the original view
    return render_template('new_sub.html', title="New Sub", form=form)
```

8. Now we're going to modify our `/r` routes to grab and pass down all created Subs to the frontend.
```python
  @app.route('/r')
  @app.route('/r/<sub>')
  def r(sub=None):
    # gets all subs up to a limit of 100
    subs = models.Sub.select().limit(100)
    
    # sends those subs down to the template
    return render_template("subs.html", subs=subs)
```
- This is great but if we visit `/r/1` we still see more subs than we need to. Let's fix that.

9. Modify the same function to display a single Sub '/r/<id>'

```python
  @app.route('/r')
  @app.route('/r/<sub>')
  def r(sub=None):
    if sub == None:
      subs = models.Sub.select().limit(100)
      return render_template("subs.html", subs=subs)
    else:
      # Find the right Sub
      sub_id = int(sub)
      sub = models.Sub.get(models.Sub.id == sub_id)
      # Send the found Sub to the template
      return render_template("sub.html", sub=sub)
```

## Steps for Posts:
1. Here we set up a new model in our already existing file but this time let's tie it to a Sub using the ForeignKeyField(). We'll also need to add the Post model to the initialize method.
```python
  # ...

  class Post(Model):
    timestamp = DateTimeField(default=datetime.datetime.now)
    user = CharField()
    title = CharField()
    text = TextField()
    # relate the Post model to the Sub model
    sub = ForeignKeyField(Sub, backref="posts") 

    class Meta:
      database = DATABASE
      order_by = ('-timestamp',)

  def initialize():
    DATABASE.connect()
    DATABASE.create_tables([Sub, Post], safe=True)
    DATABASE.close()
```

2. This is review but here we add a new Form definition to the forms file
```python
  # ...

  class PostForm(Form):
    user = TextField("By:")
    title = TextField("Title")
    text = TextAreaField("Content")
    submit = SubmitField('Create Post')
```

3. Here we return to the form builder. Where will the `sub.html` template get the `{{ form }}` object from? We add the form here because our users should be able to add a post within the sub they're already visiting.
```
  # sub.html
  # ...
      <section>
          <h2>Add a Post to this Sub</h2>
          <form method="POST" action="" novalidate>
              {{ form.hidden_tag() }}

              <div>
              {{ form.title.label }}
              {{ form.title() }}
              </div>
              <div>
              {{ form.text.label }}
              {{ form.text() }}
              </div>
              <div>
              {{ form.user.label("Post By:") }}
              {{ form.user() }}
              </div>

              {{ form.submit() }}
          </form>
      </section>
  {% endblock %}
```

4. Let's wrap up the connection between our template and the Post model. This will be a multi step process.
  - The form should create a new post
  ```python
    # ...

    # Find the right Sub
    sub_id = int(sub)
    sub = models.Sub.get(models.Sub.id == sub_id)
    
    # Define the form for Posts
    form = PostForm()
    if form.validate_on_submit():
      models.Post.create(
        user=form.user.data.strip(),
        title=form.title.data.strip(), 
        text=form.text.data.strip(), 
        sub=sub)

      flash("New post created")
      # Redirect back to the subreddit where the post was created
      return redirect("/r/{}".format(sub_id))

    return render_template("sub.html", sub=sub, form=form)
  ```

  - any existing posts should show on `sub.html` the page, so select them from the db and pass to render_template()
  ```
    {% if posts %}
      <h1>Post List</h1>
      {% for post in posts %}
      <article class="message is-primary">
          <div class="message-header">
              <a href={{url_for('posts', id=post.id)}}>{{post.title}}</a>

              <p>By: {{post.user}}</p>
          </div>
          <div class="message-body">
              {{post.text}}
          </div>
          <a>r/{{post.sub}}</a>
      </article>
      {% endfor %}
    {% endif %}
  ```

  - find exisitng posts and pass them down to the template
  ```python
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
+        posts = sub.posts
        
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
+        return render_template("sub.html", sub=sub, posts=posts, form=form)
  ```

  - posts should link to the single post page and the posts list page probably shouldn't error out
  ```python
    # ...
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
    # ...
  ```

## You Do: Comments on Posts
Here are some guidelines to follow as you build out the Comments for this project:
1. Define a model and connect it to the Post model
2. Add a comment form to the other form classes
3. Add a reference to your new form to the appropriate function in `app.py`. Comments should be attached to posts so think about where this form reference should be.
4. When a user goes to an individual Post page, list out the comments

## Stretch Goals
- add the ability to delete comments, posts, and subs
- allow a user to show and hide lists of comments in posts
- allow a user to attach an image to their post (just URL)
