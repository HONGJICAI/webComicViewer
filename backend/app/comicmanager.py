import os

from . import comicfile
from .comicfile import allowImgs, allowZips
from .models import Comic


class ComicMangager:

    def __init__(self):
        pass

    def load(self, pathes):
        for path in pathes:
            try:
                dirIsValidEntry = False
                with os.scandir(path) as entries:
                    for entry in entries:
                        if entry.is_file():
                            ext = os.path.splitext(entry.name)[-1].lower()
                            if ext in allowZips:
                                comicpath = os.path.join(path, entry.name)
                                comic = Comic.get_or_none(Comic.path == comicpath)
                                if comic is not None:
                                    # ignore comic already in db
                                    continue
                                cf = comicfile.create(comicpath)
                                if cf.page > 0:
                                    Comic.create(
                                        name=os.path.splitext(entry.name)[0],
                                        lastModifiedTime=entry.stat().st_mtime,
                                        path=comicpath,
                                        page=cf.page,
                                    )
                            elif ext in allowImgs:
                                dirIsValidEntry = True
                        else:
                            self.load([os.path.join(path, entry.name)])
                if dirIsValidEntry:
                    comic = Comic.get_or_none(Comic.path == path)                    
                    cf = comicfile.create(path)
                    if cf.page > 0:
                        if comic is None:
                            Comic.create(
                                name=os.path.split(path)[-1],
                                lastModifiedTime=0,
                                path=cf.filepath,
                                page=cf.page,
                            )
                        else:                            
                            comic.page = cf.page
                            comic.save()
            except Exception as e:
                print(e)

    def read(self, filepath, page):
        cf = comicfile.create(filepath)
        return cf.read(page)

comicmanager = ComicMangager()