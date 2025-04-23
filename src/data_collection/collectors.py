import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
from src.models import MongoDB


class DataCollector:
    def __init__(self):
        self.db = MongoDB()

    def collect_data(self, url):
        print(f"开始从 {url} 收集数据...")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
        try:
            session = requests.Session()
            retry = Retry(connect=3, backoff_factor=0.5)
            adapter = HTTPAdapter(max_retries=retry)
            session.mount('https://', adapter)

            response = session.get(url, headers=headers)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            # 这里需要根据具体的数据需求和网页结构来提取数据
            # 示例：提取所有链接
            links = soup.find_all('a')
            data = [{'link': link.get('href')} for link in links]
            collection = self.db.get_collection('links')
            collection.insert_many(data)
            print(f"成功从 {url} 收集并存储数据。")
        except requests.RequestException as e:
            print(f"请求 {url} 出错: {e}")
        except Exception as e:
            print(f"处理 {url} 数据时发生其他错误: {e}")

    def collect_economic_data(self):
        # 主要国家 GDP 增长率
        gdp_url = "https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.KD.ZG?format=json"
        print(f"开始获取主要国家 GDP 增长率数据...")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
        try:
            session = requests.Session()
            retry = Retry(connect=3, backoff_factor=0.5)
            adapter = HTTPAdapter(max_retries=retry)
            session.mount('https://', adapter)

            gdp_response = session.get(gdp_url, headers=headers)
            gdp_response.raise_for_status()
            gdp_data = gdp_response.json()[1]  # 世界银行 API 返回的数据在第二个元素中
            collection = self.db.get_collection('gdp_growth_rate')
            collection.insert_many(gdp_data)
            print("成功获取并存储主要国家 GDP 增长率数据。")
        except requests.RequestException as e:
            print(f"获取 GDP 增长率出错: {e}")
        except IndexError:
            print("解析 GDP 增长率数据时索引错误，可能是 API 响应格式改变。")
        except Exception as e:
            print(f"处理 GDP 增长率数据出错: {e}")

        # 主要国家通货膨胀率（使用世界银行 API）
        inflation_url = "https://api.worldbank.org/v2/country/all/indicator/FP.CPI.TOTL.ZG?format=json&per_page=1000"
        print(f"开始获取主要国家通货膨胀率数据...")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
        try:
            session = requests.Session()
            retry = Retry(connect=3, backoff_factor=0.5)
            adapter = HTTPAdapter(max_retries=retry)
            session.mount('https://', adapter)

            inflation_response = session.get(inflation_url, headers=headers)
            inflation_response.raise_for_status()
            inflation_data = inflation_response.json()[1]  # 世界银行 API 返回的数据在第二个元素中
            collection = self.db.get_collection('inflation_rate')
            collection.insert_many(inflation_data)
            print("成功获取并存储主要国家通货膨胀率数据。")
        except requests.RequestException as e:
            print(f"获取通货膨胀率出错: {e}")
        except IndexError:
            print("解析通货膨胀率数据时索引错误，可能是 API 响应格式改变。")
        except Exception as e:
            print(f"处理通货膨胀率数据出错: {e}")

        # 主要国家失业率（使用 OECD API）
        unemployment_url = "https://stats.oecd.org/SDMX-JSON/data/STLABOUR/LR+LRH+LRU+LRU_NOC+LRU_1564+LRU_MEN+LRU_WOMEN+LRU_1524+LRU_2554+LRU_5564+LRU_1564_NOC+LRU_MEN_NOC+LRU_WOMEN_NOC+LRU_1524_NOC+LRU_2554_NOC+LRU_5564_NOC+LRU_1564_SA+LRU_MEN_SA+LRU_WOMEN_SA+LRU_1524_SA+LRU_2554_SA+LRU_5564_SA+LRU_1564_NOC_SA+LRU_MEN_NOC_SA+LRU_WOMEN_NOC_SA+LRU_1524_NOC_SA+LRU_2554_NOC_SA+LRU_5564_NOC_SA/all?startTime=2020&endTime=2024&dimensionAtObservation=allDimensions"
        print(f"开始获取主要国家失业率数据...")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
        try:
            session = requests.Session()
            retry = Retry(connect=3, backoff_factor=0.5)
            adapter = HTTPAdapter(max_retries=retry)
            session.mount('https://', adapter)

            unemployment_response = session.get(unemployment_url, headers=headers)
            unemployment_response.raise_for_status()
            unemployment_data = unemployment_response.json()
            unemployment_records = []
            if 'dataSets' in unemployment_data and len(unemployment_data['dataSets']) > 0:
                for obs in unemployment_data['dataSets'][0]['observations']:
                    try:
                        record = {
                            'country':
                                unemployment_data['structure']['dimensions']['observation'][0]['values'][obs[0][0]][
                                    'name'],
                            'year':
                                unemployment_data['structure']['dimensions']['observation'][1]['values'][obs[0][1]][
                                    'name'],
                            'unemployment_rate': obs[1][0]
                        }
                        unemployment_records.append(record)
                    except (IndexError, KeyError):
                        print("解析失业率数据时部分记录出错，跳过该记录。")
            if unemployment_records:
                collection = self.db.get_collection('unemployment_rate')
                collection.insert_many(unemployment_records)
                print("成功获取并存储主要国家失业率数据。")
            else:
                print("未找到有效的主要国家失业率数据。")
        except requests.RequestException as e:
            print(f"获取失业率出错: {e}")
        except ValueError:
            print("解析失业率数据时发生 JSON 解析错误或转换浮点数错误。")
        except Exception as e:
            print(f"处理失业率数据出错: {e}")

        # 中国进出口总额及增长速度
        china_trade_url = "https://online.customs.gov.cn/#/search?keyword=%E8%BF%9B%E5%87%BA%E5%8F%A3%E6%80%BB%E9%A2%9D"
        print(f"开始获取中国进出口总额及增长速度数据...")
        try:
            trade_response = requests.get(china_trade_url)
            trade_response.raise_for_status()
            soup = BeautifulSoup(trade_response.text, 'html.parser')
            table = soup.find('table')
            if table:
                rows = table.find_all('tr')
                trade_data = []
                for row in rows[1:]:  # 跳过表头
                    cells = row.find_all('td')
                    if len(cells) >= 3:
                        record = {
                            'date': cells[0].text.strip(),
                            'import_total': cells[1].text.strip(),
                            'export_total': cells[2].text.strip()
                        }
                        trade_data.append(record)
                if trade_data:
                    collection = self.db.get_collection('china_trade_volume')
                    collection.insert_many(trade_data)
                    print("成功获取并存储中国进出口总额及增长速度数据。")
                else:
                    print("未找到中国进出口总额及增长速度数据。")
            else:
                # 尝试使用其他方法提取数据
                print("未找到包含中国进出口总额及增长速度数据的表格，尝试其他方法...")
                divs = soup.find_all('div', class_='relevant-data')
                for div in divs:
                    date = div.find('span', class_='date').text.strip() if div.find('span', class_='date') else None
                    import_total = div.find('span', class_='import').text.strip() if div.find('span',
                                                                                              class_='import') else None
                    export_total = div.find('span', class_='export').text.strip() if div.find('span',
                                                                                              class_='export') else None
                    if date and import_total and export_total:
                        record = {
                            'date': date,
                            'import_total': import_total,
                            'export_total': export_total
                        }
                        trade_data.append(record)
                if trade_data:
                    collection = self.db.get_collection('china_trade_volume')
                    collection.insert_many(trade_data)
                    print("成功使用备用方法获取并存储中国进出口总额及增长速度数据。")
                else:
                    print("备用方法也未找到中国进出口总额及增长速度数据。")
        except requests.RequestException as e:
            print(f"获取中国进出口总额及增长速度出错: {e}")
        except Exception as e:
            print(f"处理中国进出口总额及增长速度数据出错: {e}")

        # 中国商品和服务分类数据
        china_goods_url = "https://data.stats.gov.cn/easyquery.htm?cn=C01"
        print(f"开始获取中国商品和服务分类数据...")
        try:
            goods_response = requests.get(china_goods_url)
            goods_response.raise_for_status()
            soup = BeautifulSoup(goods_response.text, 'html.parser')
            list_items = soup.find_all('li')
            goods_data = []
            for item in list_items:
                span = item.find('span')
                div = item.find('div')
                if span and div:
                    record = {
                        'category': span.text.strip(),
                        'value': div.text.strip()
                    }
                    goods_data.append(record)
            if goods_data:
                collection = self.db.get_collection('china_goods_services')
                collection.insert_many(goods_data)
                print("成功获取并存储中国商品和服务分类数据。")
            else:
                # 尝试使用其他方法提取数据
                print("未找到中国商品和服务分类数据，尝试其他方法...")
                articles = soup.find_all('article')
                for article in articles:
                    category = article.find('h3').text.strip() if article.find('h3') else None
                    value = article.find('p').text.strip() if article.find('p') else None
                    if category and value:
                        record = {
                            'category': category,
                            'value': value
                        }
                        goods_data.append(record)
                if goods_data:
                    collection = self.db.get_collection('china_goods_services')
                    collection.insert_many(goods_data)
                    print("成功使用备用方法获取并存储中国商品和服务分类数据。")
                else:
                    print("备用方法也未找到中国商品和服务分类数据。")
        except requests.RequestException as e:
            print(f"获取中国商品和服务分类数据出错: {e}")
        except Exception as e:
            print(f"处理中国商品和服务分类数据出错: {e}")

        # 中国贸易平衡数据
        china_trade_balance_url = "https://online.customs.gov.cn/#/search?keyword=%E8%B4%B8%E6%98%93%E5%B9%B3%E8%A1%A1"
        print(f"开始获取中国贸易平衡数据...")
        try:
            balance_response = requests.get(china_trade_balance_url)
            balance_response.raise_for_status()
            soup = BeautifulSoup(balance_response.text, 'html.parser')
            balance_table = soup.find('table')
            if balance_table:
                balance_rows = balance_table.find_all('tr')
                balance_data = []
                for row in balance_rows[1:]:  # 跳过表头
                    cells = row.find_all('td')
                    if len(cells) >= 2:
                        record = {
                            'date': cells[0].text.strip(),
                            'trade_balance': cells[1].text.strip()
                        }
                        balance_data.append(record)
                if balance_data:
                    collection = self.db.get_collection('china_trade_balance')
                    collection.insert_many(balance_data)
                    print("成功获取并存储中国贸易平衡数据。")
                else:
                    print("未找到中国贸易平衡数据。")
            else:
                # 尝试使用其他方法提取数据
                print("未找到包含中国贸易平衡数据的表格，尝试其他方法...")
                sections = soup.find_all('section', class_='balance-data')
                for section in sections:
                    date = section.find('span', class_='date').text.strip() if section.find('span',
                                                                                            class_='date') else None
                    balance = section.find('span', class_='balance').text.strip() if section.find('span',
                                                                                                  class_='balance') else None
                    if date and balance:
                        record = {
                            'date': date,
                            'trade_balance': balance
                        }
                        balance_data.append(record)
                if balance_data:
                    collection = self.db.get_collection('china_trade_balance')
                    collection.insert_many(balance_data)
                    print("成功使用备用方法获取并存储中国贸易平衡数据。")
                else:
                    print("备用方法也未找到中国贸易平衡数据。")
        except requests.RequestException as e:
            print(f"获取中国贸易平衡数据出错: {e}")
        except Exception as e:
            print(f"处理中国贸易平衡数据出错: {e}")

        # 中国市场价格（股票）
        stock_url = "http://quote.eastmoney.com/center/gridlist.html#hs_a_board"
        print(f"开始获取中国市场价格（股票）数据...")
        try:
            stock_response = requests.get(stock_url)
            stock_response.raise_for_status()
            soup = BeautifulSoup(stock_response.text, 'html.parser')
            stock_table = soup.find('table')
            if stock_table:
                stock_rows = stock_table.find_all('tr')
                stock_data = []
                for row in stock_rows[1:]:  # 跳过表头
                    cells = row.find_all('td')
                    if len(cells) >= 3:
                        record = {
                            'stock_code': cells[0].text.strip(),
                            'stock_name': cells[1].text.strip(),
                            'price': cells[2].text.strip()
                        }
                        stock_data.append(record)
                if stock_data:
                    collection = self.db.get_collection('china_stock_prices')
                    collection.insert_many(stock_data)
                    print("成功获取并存储中国市场价格（股票）数据。")
                else:
                    print("未找到中国市场价格（股票）数据。")
            else:
                # 尝试使用其他方法提取数据
                print("未找到包含中国市场价格（股票）数据的表格，尝试其他方法...")
                cards = soup.find_all('div', class_='stock-card')
                for card in cards:
                    code = card.find('span', class_='stock-code').text.strip() if card.find('span',
                                                                                            class_='stock-code') else None
                    name = card.find('span', class_='stock-name').text.strip() if card.find('span',
                                                                                            class_='stock-name') else None
                    price = card.find('span', class_='stock-price').text.strip() if card.find('span',
                                                                                              class_='stock-price') else None
                    if code and name and price:
                        record = {
                            'stock_code': code,
                            'stock_name': name,
                            'price': price
                        }
                        stock_data.append(record)
                if stock_data:
                    collection = self.db.get_collection('china_stock_prices')
                    collection.insert_many(stock_data)
                    print("成功使用备用方法获取并存储中国市场价格（股票）数据。")
                else:
                    print("备用方法也未找到中国市场价格（股票）数据。")
        except requests.RequestException as e:
            print(f"获取中国股票价格出错: {e}")
        except Exception as e:
            print(f"处理中国股票价格数据出错: {e}")

        # 主要国家与人民币汇率
        exchange_rate_url = "https://www.boc.cn/sourcedb/whpj/"
        print(f"开始获取主要国家与人民币汇率数据...")
        try:
            exchange_response = requests.get(exchange_rate_url)
            exchange_response.raise_for_status()
            soup = BeautifulSoup(exchange_response.text, 'html.parser')
            exchange_table = soup.find('table')
            if exchange_table:
                exchange_rows = exchange_table.find_all('tr')
                exchange_data = []
                for row in exchange_rows[1:]:  # 跳过表头
                    cells = row.find_all('td')
                    if len(cells) >= 5:
                        record = {
                            'currency': cells[0].text.strip(),
                            'exchange_rate': cells[4].text.strip()
                        }
                        exchange_data.append(record)
                if exchange_data:
                    collection = self.db.get_collection('exchange_rates')
                    collection.insert_many(exchange_data)
                    print("成功获取并存储主要国家与人民币汇率数据。")
                else:
                    print("未找到主要国家与人民币汇率数据。")
            else:
                # 尝试使用其他方法提取数据
                print("未找到包含主要国家与人民币汇率数据的表格，尝试其他方法...")
                rows = soup.find_all('div', class_='rate-row')
                for row in rows:
                    currency = row.find('span', class_='currency').text.strip() if row.find('span',
                                                                                            class_='currency') else None
                    rate = row.find('span', class_='rate').text.strip() if row.find('span', class_='rate') else None
                    if currency and rate:
                        record = {
                            'currency': currency,
                            'exchange_rate': rate
                        }
                        exchange_data.append(record)
                if exchange_data:
                    collection = self.db.get_collection('exchange_rates')
                    collection.insert_many(exchange_data)
                    print("成功使用备用方法获取并存储主要国家与人民币汇率数据。")
                else:
                    print("备用方法也未找到主要国家与人民币汇率数据。")
        except requests.RequestException as e:
            print(f"获取汇率出错: {e}")
        except Exception as e:
            print(f"处理汇率数据出错: {e}")

        # 政策法规通知（如关税调整公告）
        policy_url = "https://www.gov.cn/"
        print(f"开始获取政策法规通知数据...")
        try:
            policy_response = requests.get(policy_url)
            policy_response.raise_for_status()
            soup = BeautifulSoup(policy_response.text, 'html.parser')
            policy_items = soup.find_all('li')
            policy_data = []
            for item in policy_items:
                a = item.find('a')
                span = item.find('span')
                if a and span:
                    record = {
                        'title': a.text.strip(),
                        'link': a.get('href'),
                        'date': span.text.strip()
                    }
                    policy_data.append(record)
            if policy_data:
                collection = self.db.get_collection('policy_notices')
                collection.insert_many(policy_data)
                print("成功获取并存储政策法规通知数据。")
            else:
                print("未找到政策法规通知数据。")
        except requests.RequestException as e:
            print(f"获取政策法规通知出错: {e}")
        except Exception as e:
            print(f"处理政策法规通知数据出错: {e}")

        # 财务报表
        financial_url = "https://www.cninfo.com.cn/new/index"
        print(f"开始获取财务报表数据...")
        try:
            financial_response = requests.get(financial_url)
            financial_response.raise_for_status()
            soup = BeautifulSoup(financial_response.text, 'html.parser')
            financial_items = soup.find_all('li')
            financial_data = []
            for item in financial_items:
                a = item.find('a')
                span = item.find('span')
                if a and span:
                    link = a.get('href')
                    if link:
                        record = {
                            'company': a.text.strip(),
                            'report_type': span.text.strip(),
                            'link': link
                        }
                        financial_data.append(record)
            if financial_data:
                collection = self.db.get_collection('financial_statements')
                collection.insert_many(financial_data)
                print("成功获取并存储财务报表数据。")
            else:
                print("未找到财务报表数据。")
        except requests.RequestException as e:
            print(f"获取财务报表出错: {e}")
        except Exception as e:
            print(f"处理财务报表数据出错: {e}")

        # 中国与外国主要港口吞吐量
        port_url = "https://xxgk.mot.gov.cn/2020/"
        print(f"开始获取中国与外国主要港口吞吐量数据...")
        try:
            port_response = requests.get(port_url)
            port_response.raise_for_status()
            soup = BeautifulSoup(port_response.text, 'html.parser')
            port_table = soup.find('table')
            if port_table:
                port_rows = port_table.find_all('tr')
                port_data = []
                for row in port_rows[1:]:  # 跳过表头
                    cells = row.find_all('td')
                    if len(cells) >= 2:
                        record = {
                            'port_name': cells[0].text.strip(),
                            'throughput': cells[1].text.strip()
                        }
                        port_data.append(record)
                if port_data:
                    collection = self.db.get_collection('port_throughput')
                    collection.insert_many(port_data)
                    print("成功获取并存储中国与外国主要港口吞吐量数据。")
                else:
                    print("未找到中国与外国主要港口吞吐量数据。")
            else:
                print("未找到包含中国与外国主要港口吞吐量数据的表格。尝试其他方法...")
                divs = soup.find_all('div', class_='port-data')
                for div in divs:
                    port_name = div.find('span', class_='port-name').text.strip() if div.find('span',
                                                                                              class_='port-name') else None
                    throughput = div.find('span', class_='throughput').text.strip() if div.find('span',
                                                                                                class_='throughput') else None
                    if port_name and throughput:
                        record = {
                            'port_name': port_name,
                            'throughput': throughput
                        }
                        port_data.append(record)
                if port_data:
                    collection = self.db.get_collection('port_throughput')
                    collection.insert_many(port_data)
                    print("成功使用备用方法获取并存储中国与外国主要港口吞吐量数据。")
                else:
                    print("备用方法也未找到中国与外国主要港口吞吐量数据。")
        except requests.RequestException as e:
            print(f"获取港口吞吐量出错: {e}")
        except Exception as e:
            print(f"处理港口吞吐量数据出错: {e}")

    def close_db_connection(self):
        self.db.close_connection()
