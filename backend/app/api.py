import os
import sys
import zipfile
import datetime
import uuid


from flasgger import Swagger
from flask import Blueprint, Flask, Response, abort, make_response
from flask import current_app as app
from flask import jsonify, redirect, request, send_from_directory
from flask_cors import CORS
import rarfile

apiv1 = Blueprint("v1", __name__)
CORS(apiv1)

allowImgs = [".jpg", ".jpeg", ".png", ".webp", ".bmp", ".gif"]
allowZips = [".zip", ".rar"]


def readComicFromZip(filepath, page=0):
    _, ext = os.path.splitext(filepath)
    if ext == ".zip":
        with zipfile.ZipFile(filepath) as archive:
            zipInfos = list(
                filter(
                    lambda x: os.path.splitext(x.filename)[-1] in allowImgs,
                    archive.infolist(),
                )
            )
            if page >= len(zipInfos):
                return False, None
            with archive.open(zipInfos[page]) as f:
                return True, f.read()
    elif ext == ".rar":
        archive = rarfile.RarFile(filepath)
        if page >= len(archive.infolist()) or page < 0:
            return False, None
        return True, archive.open(archive.infolist()[page])
    elif ext == "":
        validEntries = list(
            filter(
                lambda x: x.is_file() and os.path.splitext(x.name)[-1] in allowImgs,
                os.scandir(filepath),
            )
        )
        if page >= len(validEntries) or page < 0:
            return False, None
        with open(os.path.join(filepath, validEntries[page]), "rb") as f:
            return True, f.read()


def getComicTotalPage(filepath):
    _, ext = os.path.splitext(filepath)
    if ext == ".zip":
        with zipfile.ZipFile(filepath) as archive:
            return len(
                list(
                    filter(
                        lambda x: os.path.splitext(x)[-1] in allowImgs,
                        archive.namelist(),
                    )
                )
            )
    elif ext == ".rar":
        archive = rarfile.RarFile(filepath)
        return len(archive.infolist())
    else:
        validEntries = list(
            filter(
                lambda x: x.is_file() and os.path.splitext(x.name)[-1] in allowImgs,
                list(os.scandir(filepath)),
            )
        )
        return len(validEntries)


def loadComicsList(pathes, ret=[]):
    for path in pathes:
        try:
            dirIsValidEntry = False
            with os.scandir(path) as entries:
                for entry in entries:
                    if entry.is_file():
                        ext = os.path.splitext(entry.name)[-1].lower()
                        if ext in allowZips:
                            ret += [
                                {
                                    "id": len(ret),
                                    "name": os.path.splitext(entry.name)[0],
                                    "lastModifiedTime": entry.stat().st_mtime,
                                    "path": os.path.join(path, entry.name),
                                    "totalPage": getComicTotalPage(
                                        os.path.join(path, entry.name)
                                    ),
                                }
                            ]
                        elif ext in allowImgs:
                            dirIsValidEntry = True
                    else:
                        loadComicsList([os.path.join(path, entry.name)])
            if dirIsValidEntry:
                ret += [
                    {
                        "id": len(ret),
                        "name": os.path.split(path)[-1],
                        "lastModifiedTime": 0,
                        "path": path,
                        "totalPage": getComicTotalPage(path),
                    }
                ]
        except Exception as e:
            print(e)
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
