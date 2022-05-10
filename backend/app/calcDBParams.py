"""simple util used from various location to get the database connection
string
"""
import os.path


def getDBString():
    # will be null / none if the var isn't populated
    SQLALCHEMY_DATABASE_URL = os.getenv("DB_CONN")
    if not SQLALCHEMY_DATABASE_URL:
        # force default sql lite directory if not defined
        curdir = os.path.dirname(__file__)
        databaseFile = os.path.join(curdir, '..', 'forestclient.db')
        SQLALCHEMY_DATABASE_URL = f"sqlite://{databaseFile}"

    # if the POSTGRESQL_USER env var is populated then use a postgres
    if 'POSTGRESQL_USER' in os.environ:
        usr = os.environ['POSTGRESQL_USER']
        pss = os.environ['POSTGRESQL_PASSWORD']
        db = os.environ['POSTGRESQL_DATABASE']
        #SQLALCHEMY_DATABASE_URL = f'postgresql+pg8000://{usr}:{pss}@127.0.0.1:5432/{db}' # noqa
        SQLALCHEMY_DATABASE_URL = \
            f'postgresql+psycopg2://{usr}:{pss}@127.0.0.1:5432/{db}'
    return SQLALCHEMY_DATABASE_URL
