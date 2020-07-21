import os
import sys
import zipfile
import datetime
import uuid
import json


from flasgger import Swagger
from flask import Blueprint, Flask, Response, abort, make_response
from flask import current_app as app
from flask import jsonify, redirect, request, send_from_directory
from flask_cors import CORS
import rarfile

from .models import Comic

apiv1 = Blueprint("v1", __name__)
CORS(apiv1)


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
    if bool(request.args.get("refresh", False)) == True:        
        from .comicmanager import comicmanager
        comicmanager.load(app.config["COMICPATH"])        

    return jsonify([x.json() for x in Comic.select().where(True)])


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
    from .comicmanager import comicmanager
    comic = Comic.get_by_id(id)
    if comic is None:
        abort(404)

    if request.headers.get("If-Modified-Since") == str(comic.lastModifiedTime):
        return "", 304
    page = int(request.args.get("page", 0))
    ret, buf = comicmanager.read(comic.path, page)
    if ret:
        lastModified = datetime.datetime.fromtimestamp(comic.lastModifiedTime)
        rsp = Response(
            response=buf,
            mimetype="image/jpeg",
            headers={"Last-Modified": lastModified, "Cache-Control": "no-cache"},
        )
        return rsp

    abort(404)