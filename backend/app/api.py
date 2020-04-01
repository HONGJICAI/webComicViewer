import os
import sys
from zipfile import ZipFile

from flasgger import Swagger
from flask import Blueprint, Flask, Response, abort
from flask import current_app as app
from flask import jsonify, redirect, request, send_from_directory
from flask_cors import CORS

apiv1 = Blueprint('v1', __name__)
CORS(apiv1)

allowImgs = [".jpg", ".jpeg", ".png", ".webp", ".bmp"]
allowZips = [".zip"]


def readComicFromZip(filepath, page=0):
    with ZipFile(filepath) as archive:
        zipInfos = archive.infolist()
        if page >= len(zipInfos):
            abort(404)
        with archive.open(zipInfos[page]) as f:
            return f.read()


def loadComicsList(path):
    with os.scandir(path) as entries:
        validEntries = filter(lambda f: f.is_file() and os.path.splitext(
            f.name)[-1].lower() in allowZips, entries)
        return [{"id": id,
                 "name": os.path.splitext(entry.name)[0],
                 "lastModifiedTime": entry.stat().st_mtime,
                 "path": entry.name} for id, entry in enumerate(validEntries)]


@apiv1.route('/comics')
def comics():
    """returning a list of comics information
    This is using docstrings for specifications.
    ---
    definitions:
      Comic:
        type: object
        properties:
          id:
            type: number
          name:
            type: string
          lastModifiedTime:
            type: number
          path:
            type: string
    responses:
      200:
        description: A list of comics's information
        schema:
          $ref: '#/definitions/Comic'
    """
    if "COMICLIST" not in app.config or bool(request.args.get('refresh', False)) == True:
        app.config['COMICLIST'] = loadComicsList(app.config['COMICPATH'])
        print(app.config['COMICLIST'])

    return jsonify(app.config['COMICLIST'])


@apiv1.route('/comics/<int:id>')
def getComic(id):
    comicInfo = app.config['COMICLIST'][id]
    filepath = comicInfo['path']
    ext = os.path.splitext(filepath)[-1].lower()
    page = int(request.args.get('page', 0))
    if ext in allowZips:
        buf = readComicFromZip(os.path.join(
            app.config['COMICPATH'], filepath), page)
        return Response(response=buf, mimetype="image/jpeg")
    if ext in allowImgs:
        return send_from_directory(app.config['COMICPATH'], filepath)
    abort(404)


@apiv1.route('/videos')
def videos():
    return jsonify({})


@apiv1.route('/images')
def images():
    return jsonify({})
