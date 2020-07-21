from flasgger import Swagger
from flask import Flask


def get_app():
    app = Flask(__name__)
    from . import api, config

    swagger = Swagger(app)
    app.config.from_object("app.config.DevelopmentConfig")
    print(app.config)
    app.register_blueprint(api.apiv1, url_prefix="/api/v1")

    from .comicmanager import comicmanager
    comicmanager.load(app.config["COMICPATH"])        

    return app
