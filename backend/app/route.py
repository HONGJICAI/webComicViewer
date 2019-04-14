import os
import sys

from flasgger import Swagger
from flask import (Flask, Response, abort, jsonify, redirect, request,
                   send_from_directory)

from . import app

@app.route('/')
def home():
    return redirect('/index.html')


@app.route('/<string:path>')
def staticfile(path):
    return send_from_directory(app.config['FRONTEND'], path)

