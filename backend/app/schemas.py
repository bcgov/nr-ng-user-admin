from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class forest_client(BaseModel):
    forest_client_id: int
    forest_client_number: str
    forest_client_name: str

    class Config:
        orm_mode = True

