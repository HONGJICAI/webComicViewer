
from app.models import Comic,db

if __name__ == "__main__":    
    db.connect()
    db.create_tables([Comic])