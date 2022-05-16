## Fresh install

```
pipenv install
```

## Run the backend

```
pipenv shell
cd backend
export DB_CONN=sqlite:///forestclient.db
uvicorn app.main:app --port 5000 --reload
```

## Load data

* start by deleting the database, for now its forestclient.db

```
pipenv shell
cd backend
export DB_CONN=sqlite:///forestclient.db
python3 initdb.py
```

## Docs related to Auth

https://gitlab.gwdg.de/-/snippets/497
https://github.com/tiangolo/fastapi/issues/12
https://rasyue.com/creating-login-system-in-angular-and-fastapi/

https://github.com/tiangolo/fastapi/issues/2029

https://docs.authlib.org/en/stable/client/frameworks.html#openid-connect-userinfo

https://blog.authlib.org/2020/fastapi-google-login


https://github.com/tiangolo/fastapi/issues/1428
