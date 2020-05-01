import os


class Config(object):
    DEBUG = False
    TESTING = False
    COMICPATH = os.environ.get("COMICPATH", "comics").split(";")


class ProductionConfig(Config):
    pass


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
