import logging
from datetime import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload, load_only, selectinload

import app.models.models as models

from . import schemas

LOGGER = logging.getLogger(__name__)

def getForestClient(db: Session):
    """runs query to return all the community health service areas and the
    metadata about how many times they have been queried and when

    :param db: database session
    :type db: Session
    :return: list of sql alchemy data objects
    :rtype: list
    """
    forestClients = db.query(models.forest_client).all()
    #LOGGER.debug(f"forestClients: {forestClients}, {type(forestClients)}")
    return forestClients
