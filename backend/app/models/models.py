'''
forest client data comes from:
* https://raw.githubusercontent.com/bcgov/nr-fom-api/master/apps/api/src/migrations/main/1616015261635-forestClient.js
* https://github.com/bcgov/nr-fom-api/blob/master/apps/api/src/migrations/main/1639180924469-forestClientTypesNonCNonI.js


columns:
* forest_client_number
* name
* create_user - ignore this field for now
'''

from sqlalchemy import Column, Integer, String, Date, MetaData, Table
from app.database import Base


metadata = MetaData()

t_forest_client = Table(
    "forest_client",
    metadata,
    Column("forest_client_id", Integer, primary_key=True),
    Column("forest_client_number", String),
    Column("forest_client_name", String)
)

class forest_client(Base):
    __table__ = t_forest_client
