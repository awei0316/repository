from data_collection.collectors import DataCollector

if __name__ == "__main__":
    collector = DataCollector()
    # 收集各类经济数据
    collector.collect_economic_data()
    collector.close_db_connection()