# used to manually create the database tables.  Not really needed seeing as
# backend will already do this when it starts up.

import logging
import requests
import re

import app.models.models as models
import app.database as database
import sqlalchemy

#LOGGER = logging.getLogger(__name__)

class initDb:

    def __init__(self, engine=None):
        self.engine = engine
        self.dataSources = ['https://raw.githubusercontent.com/bcgov/nr-fom-api/master/apps/api/src/migrations/main/1616015261635-forestClient.js',
            'https://github.com/bcgov/nr-fom-api/blob/master/apps/api/src/migrations/main/1639180924469-forestClientTypesNonCNonI.js'
        ]

        if not self.engine:
            self.engine = database.engine

    def createTables(self):
        self.models = models.metadata.create_all(self.engine)

    def insertData(self):
        dbconn = self.engine.connect()
        #stmt = sqlalchemy.insert(models.forest_client)
        stmt = models.forest_client.__table__.insert()
        for srcFCData in self.dataSources:
            fcFromGit = ForestClientFromGit(srcFCData)
            fcFromGit.parse()
            cnt = 1
            buffer = []
            for record in fcFromGit.forestClientData.keys():
                #print(f'{cnt} record: {record} | {fcFromGit.forestClientData[record]}')
                if not cnt % 1000:
                    #dbconn.commit_prepared()
                    LOGGER.debug(f"inserting... {cnt}")
                    dbconn.execute(stmt, buffer)
                    buffer = []
                    #raise


                cnt += 1
                row = models.forest_client(forest_client_number=record,
                forest_client_name=fcFromGit.forestClientData[record]
                )
                stmt.values(forest_client_number=record,
                    forest_client_name=fcFromGit.forestClientData[record]
                )
                #LOGGER.debug(f"stmt: {stmt}")
                #dbconn.execute(stmt)
                buffer.append({'forest_client_number': fcFromGit.forestClientData[record],
                            'forest_client_name': record})
        dbconn.close()

class ForestClientFromGit:

    def __init__(self, fcTableUrl):
        self.fcTable = fcTableUrl
        self.forestClientData = {}
        self.fcUtil = ForestClientUtil()
        #self.parseMultiple()

    # def parseMultiple(self):
    #     files2Parse = constants.FOREST_CLIENT_IN_GIT.split("||")
    #     LOGGER.debug(f"files2Parse:{files2Parse}")
    #     for file2Parse in files2Parse:
    #         LOGGER.debug(f"parsing the file: {file2Parse}")
    #         self.parse(file2Parse)

    def parse(self, file2Parse=None):
        """pulls down the js migration file, parses out the forest clients from
        it and adds them to the 'forestClientData' property

        :param file2Parse: url to the migrations js file that has the forest
                           clients in it
        :type file2Parse: str
        """
        if not file2Parse:
            file2Parse = self.fcTable
        # pulling the data down from the git repo
        LOGGER.debug(f"file2Parse: {file2Parse}")
        response = requests.get(file2Parse)
        response.raise_for_status()
        # response.raise_for_status()
        LOGGER.debug(f"status_code: {response.status_code}")
        jsFCFile = response.text
        # the insert line marks the start of the data.  This regex detects
        # the insert line
        # sample line that shows the pattern that the next line does.
        #  ('189974', 'LUXOR-SPUR DEVELOPMENTS LTD.', CURRENT_USER),
        dataLine_regex = re.compile(
            "^\s+\('[0-9]{4,8}'\,\s+'.+'\,\s+CURRENT_USER\)\,\s*$")  # noqa
        LOGGER.debug(f"jsFCFile {type(jsFCFile)}")
        cnt = 0
        for line in jsFCFile.split('\n'):
            if dataLine_regex.match(line):
                line = line.replace(', CURRENT_USER),', '')
                line = line.replace('(', '').replace(')', '').strip()
                line = line.replace(', ', ',').replace("'", '')
                lineList = line.split(',')
                forestClientId = self.fcUtil.getPaddedForestClientID(
                    lineList[0])
                self.forestClientData[lineList[1]] = forestClientId
                if not cnt % 10000:
                    LOGGER.debug(f"read and matched: {cnt}")
                cnt += 1
        LOGGER.debug(f"number forest clients = {len(self.forestClientData)}")


class ForestClientUtil:
    def __init__(self):
        self.rolePrefix = 'fom_forest_client_'

    def getPaddedForestClientID(self, clientId):
        """Forest clients are an 8 digit field that is stored as a string.
        This method will pad the forestclient id with leading 0's to meet
        the expected 8 character length

        :param clientId: input forest client
        :type clientId: str, int
        """
        clientId_str = str(clientId)
        numChars = len(clientId_str)

        if numChars < 8:
            padding = 8 - numChars
            clientId_str = ('0' * padding) + clientId_str
        return clientId_str

    def getRoleName(self, clientID):
        fcPadded = self.getPaddedForestClientID(clientID)
        roleName = f'{self.rolePrefix}{fcPadded}'
        return roleName

if __name__ == '__main__':
    LOGGER = logging.getLogger()
    LOGGER.setLevel(logging.DEBUG)
    hndlr = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(lineno)d - %(message)s')
    hndlr.setFormatter(formatter)
    LOGGER.addHandler(hndlr)
    LOGGER.debug("test")

    db = initDb()
    db.createTables()
    db.insertData()
