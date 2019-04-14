class Config(object):
    DEBUG = False
    TESTING = False

class ProductionConfig(Config):
    pass

class DevelopmentConfig(Config):
    DEBUG = True
    FRONTEND = "../../frontend"
    COMICPATH = "../../comics"

class TestingConfig(Config):
    TESTING = True