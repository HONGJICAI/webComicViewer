import os
import sys
from zipfile import ZipFile

from flasgger import Swagger
from flask import (Blueprint, Flask, Response, abort, jsonify, redirect,
                   request, send_from_directory)
from flask_cors import CORS


api = Blueprint('api', __name__)
CORS(api)
from app import app

allowImgs = [".jpg", ".jpeg", ".png", ".webp", ".bmp"]
allowZips = [".zip"]


def readComicFromZip(filepath, page=0):
    with ZipFile(filepath) as archive:
        zipInfos = archive.infolist()
        if page >= len(zipInfos):
            abort(404)
        with archive.open(zipInfos[page]) as f:
            return f.read()


@api.route('/v1/comics')
def comics():
    files = os.listdir(app.config['COMICPATH'])
    return jsonify(list(
        filter(lambda f: os.path.splitext(f)[-1].lower() in allowZips, files)))


@api.route('/v1/comics/<string:filename>')
def getComic(filename):
    ext = os.path.splitext(filename)[-1].lower()
    page = int(request.args.get('page', 0))
    if ext in allowZips:
        buf = readComicFromZip(os.path.join(
            app.config['COMICPATH'], filename), page)
        return Response(response=buf, mimetype="image/jpeg")
    if ext in allowImgs:
        return send_from_directory(app.config['COMICPATH'], filename)
    abort(404)


@api.route('/v1/videos')
def videos():
    return jsonify({})

@api.route('/v1/images')
def images():
    return jsonify({})
