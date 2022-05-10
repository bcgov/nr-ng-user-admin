import logging
import os.path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse
import sqlalchemy.inspection
import app.models.models as models

from fastapi_pagination import Page, add_pagination, paginate

from .database import engine
from .dependencies import get_db
from . import router


logConfigFile = os.path.join(
    os.path.dirname(__file__),
    '..',
    'config',
    'logging.config')

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
Forest Client api used to serve out the greatest forest client data known to
mankind"""
app = FastAPI(
    title="Greatest Ever Community Health Serice Areas API",
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
    "http://127.0.0.1:5000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

get_db()


@app.get("/")
def main():
    return RedirectResponse(url="/docs/")

app.include_router(router.router)

add_pagination(app)