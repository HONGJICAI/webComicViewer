## Intro

[![Build Status](https://geeklovecode.visualstudio.com/PersonalStuff/_apis/build/status/HONGJICAI.webComicViewer%20(1)?branchName=master)](https://geeklovecode.visualstudio.com/PersonalStuff/_build/latest?definitionId=2&branchName=master)
![Azure Devops Tests](https://img.shields.io/azure-devops/tests/geeklovecode/PersonalStuff/2)
![Azure DevOps coverage](https://img.shields.io/azure-devops/coverage/geeklovecode/PersonalStuff/2)

This is the backend codebase for WebComicViewer App.

## Run

```
pip install -r requirements.txt
python run.py
```

## Test

```
pip install -r requirements-dev.txt
coverage run -m pytest
coverage report
coverage html
```