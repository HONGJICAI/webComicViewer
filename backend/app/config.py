import os


class Config(object):
    DEBUG = False
    TESTING = False
    FRONTEND = "../../frontend"
    COMICPATH = os.environ.get('COMICPATH', '') if os.environ.get(
        'COMICPATH', '') else "comics"


class ProductionConfig(Config):
    pass


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
