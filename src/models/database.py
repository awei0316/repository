from pymongo import MongoClient
from src.config.settings import MONGO_URI, MONGO_DB_NAME

class MongoDB:
    def __init__(self):
        self.client = MongoClient(MONGO_URI)
        self.db = self.client[MONGO_DB_NAME]

    def get_collection(self, collection_name):
        return self.db[collection_name]

    def close_connection(self):
        self.client.close()