from flasgger import Swagger
from flask import Flask

app = Flask(__name__)
from . import api, config, route

swagger = Swagger(app)
app.config.from_object("app.config.DevelopmentConfig")
app.register_blueprint(api.api, url_prefix='/api')
