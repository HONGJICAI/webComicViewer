import os
import pytest

from app import get_app


@pytest.fixture
def app():
    return get_app()


@pytest.fixture
def client(app):
    return app.test_client()


class mockFile():
    def __init__(self, return_value):
        self.return_value = return_value

    def __enter__(self):
        return self

    def __exit__(self, exc, value, tb):
        pass

    def read(self):
        return self.return_value


class mockZipInfo():
    def __init__(self, infolist):
        self._infolist = infolist

    def infolist(self):
        return self._infolist

    def __len__(self):
        return len(self._infolist)

    def __getitem__(self, index):
        return self._infolist[index]


class mockZipFile():
    def __init__(self, infolist):
        self._infolist = infolist

    def __enter__(self):
        return self

    def __exit__(self, exc, value, tb):
        pass

    def infolist(self):
        return mockZipInfo(self._infolist)

    def open(self, zipinfo):
        return mockFile(zipinfo)


@pytest.mark.parametrize("page", (0, 1))
def test_readComicFromZip(app, monkeypatch, page):
    from app.api import readComicFromZip
    import zipfile
    with app.app_context():
        mockZipInfoList = [b'testbuf']
        monkeypatch.setattr(
            zipfile, 'ZipFile', lambda x: mockZipFile(mockZipInfoList))
        ret, buf = readComicFromZip("test.zip", page)
        if page >= len(mockZipInfoList):
            assert ret == False and buf == None
        else:
            assert ret == True and buf == mockZipInfoList[page]


class mockScandir():
    def __init__(self, return_value):
        self.return_value = return_value

    def __enter__(self):
        return self.return_value

    def __exit__(self, exc, value, tb):
        pass


class mockStat():
    def __init__(self):
        self.st_mtime = 0


class mockDirEntry():
    def __init__(self, is_file, name):
        self.name = name
        self._is_file = is_file

    def is_file(self):
        return self._is_file

    def stat(self):
        return mockStat()


mockDirEntries = [
    [],
    [mockDirEntry(True, "testfile.jpg"), mockDirEntry(True, "testfile.zip"),
     mockDirEntry(False, "testdir"), mockDirEntry(False, "testdir.zip")]
]
shouldReturnNameList = [
    [],
    ["testfile"]
]


@pytest.mark.parametrize("mockScandirReturn,shouldReturnNameList", [(e, s) for e, s in zip(mockDirEntries, shouldReturnNameList)])
def test_loadComicsList(app, monkeypatch, mockScandirReturn, shouldReturnNameList):
    from app.api import loadComicsList
    with app.app_context():
        monkeypatch.setattr(
            os, 'scandir', lambda x: mockScandir(mockScandirReturn))
        comiclist = loadComicsList('test')
        assert len(comiclist) == len(shouldReturnNameList)
        for entry, actualname in zip(comiclist, shouldReturnNameList):
            assert entry['name'] == actualname


@pytest.mark.parametrize("mockScandirReturn", [e for e in mockDirEntries])
def test_comics(app, client, monkeypatch, mockScandirReturn):
    import json
    monkeypatch.setattr(
        os, 'scandir', lambda x: mockScandir(mockScandirReturn))
    # test load comic
    rsp = client.get("/api/v1/comics")
    assert rsp.status_code == 200
    with app.app_context():
        assert app.config['COMICLIST'] == json.loads(rsp.data)
    # test cache
    rsp = client.get("/api/v1/comics")
    assert rsp.status_code == 200
    with app.app_context():
        assert app.config['COMICLIST'] == json.loads(rsp.data)


mockZipInfoList = [None, [b'testbuf']]
@pytest.mark.parametrize("mockScandirReturn,mockZipInfoList", [(e, z) for e, z in zip(mockDirEntries, mockZipInfoList)])
def test_getComic(app, client, monkeypatch, mockScandirReturn, mockZipInfoList):
    import zipfile
    monkeypatch.setattr(
        os, 'scandir', lambda x: mockScandir(mockScandirReturn))
    rsp = client.get("/api/v1/comics")
    assert rsp.status_code == 200
    monkeypatch.setattr(
        zipfile, 'ZipFile', lambda x: mockZipFile(mockZipInfoList))
    for page in range(2):
        rsp = client.get("/api/v1/comics/0?page={}".format(page))
        if mockZipInfoList is not None and page < len(mockZipInfoList):
            assert rsp.status_code == 200
        else:
            assert rsp.status_code == 404


def test_videos(app, client):
    rsp = client.get("/api/v1/videos")
    assert rsp.status == '200 OK'


def test_images(app, client):
    rsp = client.get("/api/v1/images")
    assert rsp.status == '200 OK'
