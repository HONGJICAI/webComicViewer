import os
import sys
import zipfile
import datetime


from flasgger import Swagger
from flask import Blueprint, Flask, Response, abort, make_response
from flask import current_app as app
from flask import jsonify, redirect, request, send_from_directory
from flask_cors import CORS

apiv1 = Blueprint("v1", __name__)
CORS(apiv1)

allowImgs = [".jpg", ".jpeg", ".png", ".webp", ".bmp"]
allowZips = [".zip"]


def readComicFromZip(filepath, page=0):
    with zipfile.ZipFile(filepath) as archive:
        zipInfos = archive.infolist()
        if page >= len(zipInfos):
            return False, None
        with archive.open(zipInfos[page]) as f:
            return True, f.read()


def getComicTotalPage(filepath):
    with zipfile.ZipFile(filepath) as archive:
        return len(archive.infolist())


def loadComicsList(pathes):
    ret = []
    count = 0
    for path in pathes:
        with os.scandir(path) as entries:
            validEntries = filter(
                lambda f: f.is_file()
                and os.path.splitext(f.name)[-1].lower() in allowZips,
                entries,
            )
            ret += [
                {
                    "id": count + id,
                    "name": os.path.splitext(entry.name)[0],
                    "lastModifiedTime": entry.stat().st_mtime,
                    "path": os.path.join(path, entry.name),
                    "totalPage": getComicTotalPage(os.path.join(path, entry.name)),
                }
                for id, entry in enumerate(validEntries)
            ]
            count = len(ret)
    return ret


@apiv1.route("/comics")
def comics():
    """returning a list of comics information
    This is using docstrings for specifications.
    ---
    parameters:
      - name: refresh
        type: bool
        required: false
        default: false
        description: specific whether to refresh the comic list config
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
    if (
        "COMICLIST" not in app.config
        or bool(request.args.get("refresh", False)) == True
    ):
        app.config["COMICLIST"] = loadComicsList(app.config["COMICPATH"])
        print(app.config["COMICLIST"])

    return jsonify(app.config["COMICLIST"])


@apiv1.route("/comics/<int:id>")
def getComic(id):
    """returning image from zip file
    returning mimetype is "image/jpeg"
    ---
    parameters:
      - name: id
        type: int
        required: true
        default: 0
        description: comic id
      - name: page
        type: int
        in: path
        required: false
        default: 0
        description: comic page
    responses:
      200:
        description: Specific comic image with mimetype="image/jpeg"
      404:
        description: Specific comic id or comic page not exist
    """
    if id >= len(app.config["COMICLIST"]):
        abort(404)
    request.headers.get("Last-Lodified")

    comicInfo = app.config["COMICLIST"][id]
    filepath = comicInfo["path"]
    lastModified = datetime.datetime.fromtimestamp(comicInfo["lastModifiedTime"])
    if request.headers.get("If-Modified-Since") == str(lastModified):
        return "", 304
    page = int(request.args.get("page", 0))
    ret, buf = readComicFromZip(filepath, page)
    if ret:
        lastModified = datetime.datetime.fromtimestamp(comicInfo["lastModifiedTime"])
        rsp = Response(
            response=buf,
            mimetype="image/jpeg",
            headers={"Last-Modified": lastModified, "Cache-Control": "no-cache"},
        )
        return rsp

    abort(404)


@apiv1.route("/videos")
def videos():
    return jsonify({})


@apiv1.route("/images")
def images():
    return jsonify({})
