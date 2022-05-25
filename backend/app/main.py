import logging
import os.path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse, HTMLResponse
from starlette.middleware.sessions import SessionMiddleware
from starlette.config import Config
from starlette.requests import Request

import sqlalchemy.inspection
import app.models.models as models

from fastapi_pagination import Page, add_pagination, paginate

from authlib.integrations.starlette_client import OAuth, OAuthError

from .database import engine
from .dependencies import get_db
from . import router

# from fastapi.security import OID

logConfigFileProd = 'logging.config'
logConfigFileDev = 'logging-dev.config'
logConfigFile = os.path.join(
    os.path.dirname(__file__),
    '..',
    'config',
    logConfigFileDev)

logging.config.fileConfig(
    logConfigFile,
    disable_existing_loggers=False
)

LOGGER = logging.getLogger('main')

# should create all the tables if they are not already created
models.metadata.create_all(bind=engine)

if not sqlalchemy.inspection.inspect(engine).has_table("forest_client"):
    models.metadata.create_all(engine)

tags_metadata = [{
        "name": "forest_client",
        "description": "simple api to serve out forest client data"
    },
]

description = """
Forest Client api"""
app = FastAPI(
    title="Forest Client API",
    description=description,
    version='0.0.1',
    contact={
        "name": "Guy Lafleur",
        "url": "https://en.wikipedia.org/wiki/Guy_Lafleur",
        "email": "guy.lafleur@montreal.canadians.ca",
    },
    license_info={
        "name": "Apache 2.0",
        "url": "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
    openapi_tags=tags_metadata
)


# "*"
origins = [
    "http://localhost:8888",
    "https://localhost:8888",
    "http://localhost:5000",
    "https://localhost:5000",
    "https://localhost:8888",
    "http://localhost:8888",
    "http://localhost:8002",
    "https://localhost:8002",
    "http://localhost:8080",
    "http://127.0.0.1:5000",
    "http://127.0.0.1:4204",
    "http://localhost:4204"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)
app.add_middleware(SessionMiddleware, secret_key="!secret")


get_db()

config = Config()
oauth = OAuth(config)

CONF_URL = os.environ['OIDC_WELLKNOWN_URL']
oauth.register(
    name='keycloak',
    client_id=os.environ['OIDC_CLIENT_ID'],
    client_secret=os.environ['OIDC_SECRET'],
    authorize_url=os.environ['OIDC_AUTH_URL'],
    server_metadata_url=CONF_URL,
    client_kwargs={
        'scope': 'openid email profile',
        'code_challenge_method': 'S256'  # enable PKCE
    },
    follow_redirects=True,
)



@app.get("/")
def main():
    return RedirectResponse(url="/docs/")



@app.get('/login')
async def login(request: Request):
# def login(request: Request):
    # absolute url for callback
    # we will define it below
    redirect_uri = request.url_for('auth')
    print(f"redirect uri: {redirect_uri}")
    return await oauth.keycloak.authorize_redirect(request, redirect_uri)
    # return oauth.keycloak.authorize_redirect(request, redirect_uri)

@app.get('/auth')
async def auth(request: Request):
    try:
        #token = await oauth.google.authorize_access_token(request)
        token = await oauth.keycloak.authorize_access_token(request)
    except OAuthError as error:
        return HTMLResponse(f'<h1>{error.error}</h1>')
    user = token.get('userinfo')
    if user:
        request.session['user'] = dict(user)
    return RedirectResponse(url='/')

@app.get("/login/keycloak")
async def login_via_google(request: Request):
    redirect_uri = request.url_for('auth')
    redirect_uri2 = request.url_for('auth_via_keycloak')
    LOGGER.debug(f"redirect: {redirect_uri}")
    LOGGER.debug(f"redirect2: {redirect_uri2}")

    return await oauth.keycloak.authorize_redirect(request, redirect_uri)

@app.get("/auth/keycloak")
async def auth_via_keycloak(request: Request):
    LOGGER.debug("auth called")
    token = await oauth.keycloak.authorize_access_token(request)
    LOGGER.debug(f"token: {token}")
    user = token['userinfo']
    LOGGER.debug(f"token: {token}")
    return dict(user)

app.include_router(router.router)

add_pagination(app)