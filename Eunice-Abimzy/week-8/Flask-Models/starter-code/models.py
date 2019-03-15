import datetime
#import everything from peewee because we might need them later
# peewee is a small and simple ORM, like mongoose but simpler
from peewee import *

# We use the built in SqliteDatabase() function from peewee 
# Define or Save a reference to the DB file as a DATABASE variable

DATABASE = SqliteDatabase('brockit.db')

 # Our Sub model is pretty simple, just a name and description for now
class Sub(Model):
    timestamp = DateTimeField(default=datetime.datetime.now)
    name = CharField()
    description = TextField() 

    class Meta:
        database = DATABASEorder_by = ('-timestamp')

# We initialize a connection to the DATABASE, create a table for the Sub model, 
  # and close the connection
def initialize():
    DATABASE.connect()
    DATABASE.create_tables([Sub], safe=True)  
    DATABASE.close()