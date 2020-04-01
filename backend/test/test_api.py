import os
import pytest

from app import get_app


@pytest.fixture
def app():
    return get_app()


@pytest.fixture
def client(app):
    return app.test_client()


class mockScandir():
    def __init__(self,return_value):
        self.return_value = return_value
    def __enter__(self):
        return self.return_value

    def __exit__(self, exc, value, tb):
        pass


def mock_scandir(path):
    return mockScandir([])


def test_loadComicsList(app, monkeypatch):
    from app.api import loadComicsList
    with app.app_context():
        monkeypatch.setattr(os, 'scandir', mock_scandir)
        loadComicsList('test')


def test_comics(app, client, monkeypatch):
    monkeypatch.setattr(os, 'scandir', mock_scandir)
    rsp = client.get("/api/v1/comics")
    assert rsp.status == '200 OK'


def test_getComic(app, client, monkeypatch):
    monkeypatch.setattr(os, 'scandir', mock_scandir)
    rsp = client.get("/api/v1/comics")
    assert rsp.status == '200 OK'
    rsp = client.get("/api/v1/comic/0")
    assert rsp.status == '404 NOT FOUND'


def test_videos(app, client):
    rsp = client.get("/api/v1/videos")
    assert rsp.status == '200 OK'


def test_images(app, client):
    rsp = client.get("/api/v1/images")
    assert rsp.status == '200 OK'
