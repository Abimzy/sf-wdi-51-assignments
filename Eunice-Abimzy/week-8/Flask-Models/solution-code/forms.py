from flask_wtf import FlaskForm as Form
from wtforms import TextField, TextAreaField, SubmitField

from models import Sub

class SubForm(Form):
  name = TextField("Name this sub:")
  description = TextAreaField("Sub description:")
  submit = SubmitField('Create Sub')

class PostForm(Form):
  user = TextField("By:")
  title = TextField("Title")
  text = TextAreaField("Content")
  submit = SubmitField('Create Post')