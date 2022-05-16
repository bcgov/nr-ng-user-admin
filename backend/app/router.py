import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi_pagination import Page, add_pagination, paginate
from starlette.requests import Request
from starlette.responses import RedirectResponse
import os
from . import crud, dependencies, schemas

LOGGER = logging.getLogger(__name__)

router = APIRouter()

@router.get("/forest_client", response_model=Page[schemas.forest_client],
            tags=['forest_client'])
def show_records(db: Session = Depends(dependencies.get_db)):
    """
    Returns the full data structure of all the data that has been collected for
    each community health map query.
    """
    queryData = crud.getForestClient(db)
    return paginate(queryData)

