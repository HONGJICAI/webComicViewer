import os
import zipfile

import rarfile

allowImgs = [".jpg", ".jpeg", ".png", ".webp", ".bmp", ".gif"]
allowZips = [".zip", ".rar"]

def create(filepath):
    _, ext = os.path.splitext(filepath)
    if ext == ".zip":
        return ZipComicfile(filepath)
    elif ext == ".rar":
        return RarComicfile(filepath)
    elif ext == "":
        return DirectoryComicfile(filepath)
    
    return None

import pysnooper

class ZipComicfile():
    def __init__(self, filepath):
        self.filepath = filepath
        self._archive = zipfile.ZipFile(filepath)
        self._namelist = list(
            filter(
                lambda x: os.path.splitext(x)[-1] in allowImgs,
                self._archive.namelist(),
            )
        )
        self.page = len(self._namelist)

    @pysnooper.snoop()
    def read(self, page=0):
        if page >= len(self._namelist):
            return False, None
        return True, self._archive.read(self._namelist[page])


class RarComicfile():
    def __init__(self, filepath):
        self.filepath = filepath
        self._archive = rarfile.RarFile(filepath)
        self._namelist = list(
            filter(
                lambda x: os.path.splitext(x)[-1] in allowImgs,
                self._archive.namelist(),
            )
        )
        self.page = len(self._namelist)

    def read(self, page=0):
        if page >= len(self._namelist):
            return False, None
        return True, self._archive.read(self._namelist[page])


class DirectoryComicfile():

    def __init__(self, filepath):
        self.filepath = filepath
        self._valid_entries = list(
            filter(
                lambda x: x.is_file() and os.path.splitext(
                    x.name)[-1] in allowImgs,
                list(os.scandir(filepath)),
            )
        )
        self.page = len(self._valid_entries)

    def read(self, page=0):
        if page >= len(self._valid_entries):
            return False, None
        with open(os.path.join(self.filepath, self._valid_entries[page]), "rb") as f:
            return True, f.read()
