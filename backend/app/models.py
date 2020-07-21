import datetime

from peewee import *

db = SqliteDatabase('webcomic.db')


class BaseModel(Model):
    class Meta:
        database = db
    
    def json(self):
        return self.__dict__['__data__']


class Comic(BaseModel):
    id = AutoField()
    name = TextField()
    lastModifiedTime = DateTimeField(default=datetime.datetime.now)
    path = TextField()
    page = IntegerField()
    favarite = BooleanField(default=False)
    vote = IntegerField(default=0)

