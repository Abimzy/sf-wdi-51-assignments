import datetime
# peewee is a small and simple ORM, like mongoose but simpler
from peewee import *

DATABASE = SqliteDatabase('breddit.db')

class Sub(Model):
  timestamp = DateTimeField(default=datetime.datetime.now)
  name = CharField()
  description = TextField()

  class Meta:
    database = DATABASE
    order_by = ('-timestamp',)

class Post(Model):
  timestamp = DateTimeField(default=datetime.datetime.now)
  user = CharField()
  title = CharField()
  text = TextField()
  sub = ForeignKeyField(Sub, backref="posts") 

  class Meta:
    database = DATABASE
    order_by = ('-timestamp',)

def initialize():
  DATABASE.connect()
  DATABASE.create_tables([Sub, Post], safe=True)
  DATABASE.close()
