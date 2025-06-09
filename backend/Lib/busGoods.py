# coding=utf-8
# 数据库表的操作方法




from time import localtime, strftime
import random
import pymysql
import os
import shutil


# 数据库基本操作类库
def  config():
    constr = {
        'ENGINE': 'django.db.backends.mysql',    # 数据库引擎
        'NAME': 'dbmao', # 数据库名称
        'HOST': '127.0.0.1', # 数据库地址，本机 ip 地址 127.0.0.1
        'PORT': 3306, # 端口
        'USER': 'root',  # 数据库用户名
        'PASSWORD': 'root', # 数据库密码
    }
    return constr


# 执行sql命令语句
def SQLexec(sql):
    c = config()
    # 连接数据库
    conn = pymysql.connect(host=c.get('HOST'), user=c.get('USER'), passwd=c.get('PASSWORD'), db=c.get('NAME'),
                           charset='utf8', port=3306)
    # 创建游标
    cursor = conn.cursor()
    # 执行sql语句
    rows = cursor.execute(sql)
    # 提交
    conn.commit()
    # 关闭游标
    cursor.close()
    # 关闭连接
    conn.close()
    return rows
# 执行sql命令语句
def SQLexecAuto(sql,csql):
    c = config()
    # 连接数据库
    conn = pymysql.connect(host=c.get('HOST'), user=c.get('USER'), passwd=c.get('PASSWORD'), db=c.get('NAME'),
                           charset='utf8', port=3306)
    # 创建游标
    cursor = conn.cursor()
    # 执行sql语句
    rows = cursor.execute(sql)
    #执行查询

    cursor.execute(csql)
    row_all = cursor.fetchall()

    # 提交
    conn.commit()
    # 关闭游标
    cursor.close()
    # 关闭连接
    conn.close()
    return rows,row_all

# 执行sql命令语句
def SQLexec_search(sql):
    c = config()
    # 连接数据库
    conn = pymysql.connect(host=c.get('HOST'), user=c.get('USER'), passwd=c.get('PASSWORD'), db=c.get('NAME'),
                           charset='utf8', port=3306)
    # 创建游标
    cursor = conn.cursor()
    # 执行sql语句
    cursor.execute(sql)
    row_all = cursor.fetchall()
    # 关闭游标
    cursor.close()
    # 关闭连接
    conn.close()
    return row_all





class busGoods():
    def __init__(self):
        pass



    # 登录
    def getspguserLogin(self, x_rdfuno,x_rdfups,x_rdfurole):


        sql = "SELECT id,rdfuno,rdfups,rdfuxm," \
              "rdfusex,rdfutel,rdfunj,rdfurole,rdftx  from t_spguser where rdfuno = '{0}' and rdfups='{1}'    ".format(x_rdfuno,x_rdfups)
        data = SQLexec_search(sql)
        if data:
            x_spguser = {
                "id": data[0][0],
                "rdfuno": data[0][1],
                "rdfups": data[0][2],
                "rdfuxm": data[0][3],
                "rdfusex": data[0][4],
                "rdfutel": data[0][5],
                "rdfunj": data[0][6],
                "rdfurole": data[0][7],
                "rdftx": data[0][8],

               
            }
            return x_spguser

    # 通过账号查询用户信息
    def getspguserbyno(self, x_rdfuno):

        sql = "SELECT id,rdfuno,rdfups,rdfuxm," \
              "rdfusex,rdfutel,rdfunj,rdfurole ,rdftx from t_spguser where rdfuno = '{0}'  ".format(
            x_rdfuno)
        data = SQLexec_search(sql)
        if data:
            x_spguser = {
                "id": data[0][0],
                "rdfuno": data[0][1],
                "rdfups": data[0][2],
                "rdfuxm": data[0][3],
                "rdfusex": data[0][4],
                "rdfutel": data[0][5],
                "rdfunj": data[0][6],
                "rdfurole": data[0][7],
                "rdftx": data[0][8],
            }
            return x_spguser

    # 通过编号查询用户信息
    def getspguserbyid(self, x_id):
        sql = "SELECT id,rdfuno,rdfups,rdfuxm," \
              "rdfusex,rdfutel,rdfunj,rdfurole ,rdftx from t_spguser where id = {0}  ".format(
            x_id)
        data = SQLexec_search(sql)
        if data:
            x_spguser = {
                "id": data[0][0],
                "rdfuno": data[0][1],
                "rdfups": data[0][2],
                "rdfuxm": data[0][3],
                "rdfusex": data[0][4],
                "rdfutel": data[0][5],
                "rdfunj": data[0][6],
                "rdfurole": data[0][7],
                "rdftx": data[0][8],
            }
            return x_spguser


    # 用户增加
    def spguserAdd(self, x_spguser):
        y_spguser = self.getspguserbyno(x_spguser.get('rdfuno'))
        if y_spguser:
            return False
        else:
            sql = "insert into t_spguser(" \
                  "rdfuno, rdfups, rdfuxm, rdfusex,rdfutel,rdfunj,rdfurole,rdftx " \
                  ") values('{}','{}','{}','{}','{}','{}','{}','{}')".format(
                x_spguser.get('rdfuno'),
                x_spguser.get('rdfups'),
                x_spguser.get('rdfuxm'),
                x_spguser.get('rdfusex'),
                x_spguser.get('rdfutel'),
                x_spguser.get('rdfunj'),
                x_spguser.get('rdfurole'),
                x_spguser.get('rdftx'),
            )
            SQLexec(sql)
            return True

    # 通过条件查询用户信息
    def getspguserlist(self, _where):
        sql = "SELECT id,rdfuno,rdfups,rdfuxm," \
              "rdfusex,rdfutel,rdfunj,rdfurole ,rdftx from t_spguser where 1=1    {0}".format(_where)
        _table = SQLexec_search(sql)
        data = [row for row in _table]
        return  data

    # 通过条件查询用户信息分页
    def getspguserlistPage(self, _where, index, pageNum):
        sql = "SELECT id,rdfuno,rdfups,rdfuxm," \
              "rdfusex,rdfutel,rdfunj,rdfurole,rdftx  from t_spguser  where  1=1  {0}  order by id desc  limit {1},{2}   ".format(
            _where, index, pageNum)

        _table = SQLexec_search(sql)
        data = [row for row in _table]
        return data


    # 用户信息删除
    def spguserDel(self, x_id):
        sql = "delete from t_spguser where id = {0} ".format(x_id)
        rows = SQLexec(sql)

    # 用户信息修改
    def spguserUpdate(self, x_spguser):
        sql = "UPDATE t_spguser set rdfuxm='{0}' ,rdfusex='{1}',rdfutel='{2}' ,rdfunj='{3}',rdftx='{4}'  where id = {5}".format(
            x_spguser.get('rdfuxm'),
            x_spguser.get('rdfusex'),
            x_spguser.get('rdfutel'),
            x_spguser.get('rdfunj'),
            x_spguser.get('rdftx'),
            x_spguser.get('id'),
        )
        print(sql)
        rows = SQLexec(sql)
        return  True

    # 密码修改
    def spguserPassUpdate(self, x_spguser):

        sql = "UPDATE t_spguser set rdfups='{0}'  where id = {1}".format(
           x_spguser.get('rdfups'),
            x_spguser.get('id'),
        )
        print(sql)
        rows = SQLexec(sql)
        return True

   
 
   # 通过编号查询商品房信息
    def getspggoodbynm(self, rdfbno):
        sql = "SELECT id, rdfbno,rdfbsm,rdfbzz,rdfbcbs,rdftnm,rdfjnm,rdfbwz,rdfjiage,rdfbzt,rdfpro,rdfcity,rdfpic,rdftype  from t_spggood where rdfbno = '{0}'  ".format(
            rdfbno)
        data = SQLexec_search(sql)
        if data:
            x_spggood = {
                "id": data[0][0],
                "rdfbno": data[0][1],
                "rdfbsm": data[0][2],
                "rdfbzz": data[0][3],
                "rdfbcbs": data[0][4],
                "rdftnm": data[0][5],
                "rdfjnm": data[0][6],
                "rdfbwz": data[0][7],
                "rdfjiage": data[0][8],
                "rdfbzt": data[0][9],
                "rdfpro": data[0][10],
                "rdfcity": data[0][11],
                "rdfpic": data[0][12],
                "rdftype": data[0][13],


            }
            return x_spggood
    # 通过编号查询商品房信息
    def getspggoodbyno(self, rdfbno):
        sql = "SELECT id, rdfbno,rdfbsm,rdfbzz,rdfbcbs,rdftnm,rdfjnm,rdfbwz,rdfjiage,rdfbzt,rdfpro,rdfcity,rdfpic,rdftype from t_spggood where rdfbno = '{0}'   ".format(
            rdfbno)
        data = SQLexec_search(sql)
        if data:
            x_spggood = {
                "id": data[0][0],
                "rdfbno": data[0][1],
                "rdfbsm": data[0][2],
                "rdfbzz": data[0][3],
                "rdfbcbs": data[0][4],
                "rdftnm": data[0][5],
                "rdfjnm": data[0][6],
                "rdfbwz": data[0][7],
                "rdfjiage": data[0][8],
                "rdfbzt": data[0][9],
                "rdfpro": data[0][10],
                "rdfcity": data[0][11],
                "rdfpic": data[0][12],
                "rdftype": data[0][13],

            }
            return x_spggood

    # 通过编号查询商品房信息
    def getspggoodbyid(self, x_id):
        sql = "SELECT id, rdfbno,rdfbsm,rdfbzz,rdfbcbs,rdftnm,rdfjnm,rdfbwz,rdfjiage,rdfbzt,rdfpro,rdfcity,rdfpic,rdftype from t_spggood where id = {0}   ".format(
            x_id)
        data = SQLexec_search(sql)
        if data:
            x_spggood = {
                "id": data[0][0],
                "rdfbno": data[0][1],
                "rdfbsm": data[0][2],
                "rdfbzz": data[0][3],
                "rdfbcbs": data[0][4],
                "rdftnm": data[0][5],
                "rdfjnm": data[0][6],
                "rdfbwz": data[0][7],
                "rdfjiage": data[0][8],
                "rdfbzt": data[0][9],
                "rdfpro": data[0][10],
                "rdfcity": data[0][11],
                "rdfpic": data[0][12],
                "rdftype": data[0][13],
            }
            return x_spggood


    # 商品房增加
    def spggoodAdd(self, x_spggood):

            sql = "insert into t_spggood(" \
                  "rdfbno,rdfbsm,rdfbzz,rdfbcbs,rdftnm,rdfjnm,rdfbwz,rdfjiage,rdfbzt,rdfpro,rdfcity,rdfpic,rdftype,a1,a2,a3,a4,a5,a6,a7 " \
                  ") values('{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}')".format(
                x_spggood.get('rdfbno'),
                x_spggood.get('rdfbsm'),
                x_spggood.get('rdfbzz'),
                x_spggood.get('rdfbcbs'),
                x_spggood.get('rdftnm'),
                x_spggood.get('rdfjnm'),
                x_spggood.get('rdfbwz'),
                x_spggood.get('rdfjiage'),
                x_spggood.get('rdfbzt'),
                x_spggood.get('rdfpro'),
                x_spggood.get('rdfcity'),
                x_spggood.get('rdfpic'),
                x_spggood.get('rdftype'),
                x_spggood.get('a1'),
                x_spggood.get('a2'),
                x_spggood.get('a3'),
                x_spggood.get('a4'),
                x_spggood.get('a5'),
                x_spggood.get('a6'),
                x_spggood.get('a7'),
            )
            print(sql)
            SQLexec(sql)
            return True

    # 通过条件查询商品房信息
    def getspggoodlist(self, _where):
        sql = "SELECT id,rdfbno,rdfbsm,rdfbzz,rdfbcbs,rdftnm,rdfjnm,rdfbwz,rdfjiage,rdfbzt,rdfpro,rdfcity,rdfpic,rdftype  from t_spggood where 1=1    {0}".format(_where)
        _table = SQLexec_search(sql)
        data = [row for row in _table]
        return  data

    # 通过条件查询商品房信息分页
    def getspggoodlistPage(self, _where, index, pageNum):
        sql = "SELECT id,rdfbno,rdfbsm,rdfbzz,rdfbcbs,rdftnm,rdfjnm,rdfbwz,rdfjiage,rdfbzt,rdfpro,rdfcity,rdfpic,rdftype   from t_spggood  where  1=1   {0}  order by id asc  limit {1},{2}   ".format(
            _where, index, pageNum)

        _table = SQLexec_search(sql)
        data = [row for row in _table]
        return data

    # 通过条件查询商品房信息分页
    def getspggoodlistPageX(self, _where, index, pageNum):
        sql = "SELECT id,rdfbno,rdfbsm,rdfbzz,rdfbcbs,rdftnm,rdfjnm,rdfbwz,rdfjiage,rdfbzt,rdfpro,rdfcity,rdfpic,rdftype   from t_spggood  where  1=1   {0}  order by rdfbzt desc  limit {1},{2}   ".format(
            _where, index, pageNum)

        _table = SQLexec_search(sql)
        data = [row for row in _table]
        return data
    # 通过条件查询商品房信息分页
    def getspggoodlistPageY(self, _where, index, pageNum):
        sql = "SELECT id,rdfbno,rdfbsm,rdfbzz,rdfbcbs,rdftnm,rdfjnm,rdfbwz,rdfjiage,rdfbzt,rdfpro,rdfcity,rdfpic,rdftype   from t_spggood  where  1=1  AND rdfjnm like  '%2022%' {0}  order by rdfbcbs desc  limit {1},{2}   ".format(
            _where, index, pageNum)

        _table = SQLexec_search(sql)
        data = [row for row in _table]
        return data


    # 通过条件查询商品房信息
    def getspggoodlistTe(self, rdfuno):
        sql = "select   rdfbno,rdfbsm,rdfbzz,rdfbcbs,a1,a2,a3,a4,a5,a6,a7,rdftype   from t_spggood    "
        _table = SQLexec_search(sql)
        data = [row for row in _table]
        return data



    # 商品房信息删除
    def spggoodDel(self, x_id):
        sql = "delete from t_spggood where id = {0} ".format(x_id)
        rows = SQLexec(sql)
        # 商品房信息删除

    def spggoodDelALL(self):
        sql = "delete from t_spggood  "
        rows = SQLexec(sql)
    # 商品房信息修改
    def spggoodUpdate(self, x_spggood):
        sql = "UPDATE t_spggood set  rdfbno='{0}', rdfbsm='{1}',rdfbzz='{2}',rdfbcbs='{3}',rdftnm='{4}',rdfjnm='{5}',rdfbwz='{6}',rdfjiage='{7}',rdfbzt='{8}',rdfpro='{9}',rdfcity='{10}',rdfpic='{11}',rdftype='{12}'   where id = {13}".format(
            x_spggood.get('rdfbno'),
            x_spggood.get('rdfbsm'),
            x_spggood.get('rdfbzz'),
            x_spggood.get('rdfbcbs'),
            x_spggood.get('rdftnm'),
            x_spggood.get('rdfjnm'),
            x_spggood.get('rdfbwz'),

            x_spggood.get('rdfjiage'),
            x_spggood.get('rdfbzt'),

            x_spggood.get('rdfpro'),
            x_spggood.get('rdfcity'),
            x_spggood.get('rdfpic'),
            x_spggood.get('rdftype'),


            x_spggood.get('id'),

        )
        print(sql)
        rows = SQLexec(sql)
        return  True

        # 在线咨询增加

    def yanyuanAdd(self, x_yanyuan):

            sql = "insert into t_yanyuan(" \
                  "dybt, dycon, addtime, dyhon,haddtime,rdfuno,rdfuxm  " \
                  ") values('{}','{}','{}','{}','{}','{}','{}' )".format(
                x_yanyuan.get('dybt'),
                x_yanyuan.get('dycon'),
                x_yanyuan.get('addtime'),
                x_yanyuan.get('dyhon'),
                x_yanyuan.get('haddtime'),
                x_yanyuan.get('rdfuno'),
                x_yanyuan.get('rdfuxm'),

            )
            SQLexec(sql)
            return True

        # 通过条件查询在线咨询信息

    def getyanyuanlist(self, _where):
        sql = "SELECT id,dybt, dycon, addtime, dyhon,haddtime,rdfuno,rdfuxm  from t_yanyuan where 1=1    {0}".format(
            _where)
        _table = SQLexec_search(sql)
        data = [row for row in _table]
        return data

        # 通过条件查询在线咨询信息分页

    def getyanyuanlistPage(self, _where, index, pageNum):
        sql = "SELECT id,dybt, dycon, addtime, dyhon,haddtime,rdfuno,rdfuxm  from t_yanyuan  where  1=1  {0}  order by id desc  limit {1},{2}   ".format(
            _where, index, pageNum)

        _table = SQLexec_search(sql)
        data = [row for row in _table]
        return data

        # 在线咨询信息删除

    def yanyuanDel(self, x_id):
        sql = "delete from t_yanyuan where id = {0} ".format(x_id)
        rows = SQLexec(sql)

        # 在线咨询信息修改

    def yanyuanUpdate(self, x_yanyuan):
        sql = "UPDATE t_yanyuan set dyhon='{0}' ,haddtime='{1}'  where id = {2}".format(
            x_yanyuan.get('dyhon'),
            x_yanyuan.get('haddtime'),

            x_yanyuan.get('id'),
        )
        print(sql)
        rows = SQLexec(sql)
        return True

    def getyanyuanbyid(self, x_id):
        sql = "SELECT id, dybt,dycon,addtime,dyhon ,haddtime,rdfuno,rdfuxm  from t_yanyuan where id = {0}  ".format(
            x_id)
        data = SQLexec_search(sql)
        if data:
            x_yanyuan = {
                "id": data[0][0],
                "dybt": data[0][1],
                "dycon": data[0][2],
                "addtime": data[0][3],
                "dyhon": data[0][4],
                "haddtime": data[0][5],
                "rdfuno": data[0][6],
                "rdfuxm": data[0][7],

            }
            return x_yanyuan






























    #  商品房数量
    def getspggoodZcnt(self):
        sql = "select count(*) as cnt  from t_spggood  "
        data = SQLexec_search(sql)
        cnt=0
        if data:
            cnt=int(data[0][0])

            return cnt
        #  商品房数量

    def getspggoodZXcnt(self):
        sql = "select sum(rdfbzt) as cnt  from t_spggood  "
        data = SQLexec_search(sql)
        cnt = 0
        if data:
            cnt = int(data[0][0])

            return cnt
    #  商品房数量
    def getspggood5cnt(self,rdftnm):
        sql = "select count(*) as cnt  from t_spggood  where rdftnm='{}' ".format(rdftnm)
        data = SQLexec_search(sql)
        cnt = 0
        if data:
            cnt = int(data[0][0])

            return cnt




    def getspggoodPcnt(self):
        sql = "select rdfpro,cnt from v_t_spggood_pro   order by cnt desc     limit 0,14   "
        _table = SQLexec_search(sql)

        if _table:
            data = [row for row in _table]
            return data

    def getspggoodCcnt(self):
        sql = "select  rdfcity as  rdfpro,cnt from v_t_spggood_city   order by cnt desc     limit 0,14   "
        _table = SQLexec_search(sql)

        if _table:
            data = [row for row in _table]
            return data


    def getspggoodXcnt(self):
        sql = "select rdfbsm, rdfbzt  from  t_spggood   order by convert(rdfbzt,decimal(18,2))  desc     limit 0,100  "
        _table = SQLexec_search(sql)

        if _table:
            data = [row for row in _table]
            return data

    def getspggoodJcnt(self):
        sql = "select rdfbsm, rdfjiage  from  t_spggood   order by   convert(rdfjiage,decimal(18,2))  desc     limit 0,100  "
        _table = SQLexec_search(sql)

        if _table:
            data = [row for row in _table]
            return data


    def getspgcomTong(self,whe):
        sql = "select  * from v_t_spgcom  where 1=1 {0}  ORDER BY addtime desc  ".format(whe)
        _table = SQLexec_search(sql)
        if _table:
            data = [row for row in _table]
            return data



    # 商品房增加
    def spgredAdd(self, x_spgred):
        addtime = strftime("%Y-%m-%d %H:%M:%S", localtime())
        sql = "insert into t_spgred(" \
              "rdfuno,jid,addtime ) values('{}',{},'{}')".format(
            x_spgred.get('rdfuno'),
            x_spgred.get('jid'),
            addtime,

        )
        SQLexec(sql)
        return True

    def getspggoodsql(self,sql):

        _table = SQLexec_search(sql)

        if _table:
            data = [row for row in _table]
            return data



   # 增加
    def TTAdd(self, biao,dyf1,dyid):

            sql = "insert into "+biao+"(" \
                  "dyf1, dyid  ) values('{}','{}')".format(
                dyf1,
                dyid,

            )
            SQLexec(sql)
            return True
    def write_content_list_to_file(self, target_file_path, content_list):
            try:
                with open(target_file_path, 'w', encoding='utf-8') as file:

                        file.write(str(content_list))
                print("文件写入成功。")
            except Exception as e:
                print(f"写入文件时出现错误: {e}")

            # 逐行读取文件内容

    def read_file_content_line_by_line(self, source_file_path):
            try:
                with open(source_file_path, 'r', encoding='utf-8') as file:
                    for line in file:
                        stripped_line = line.strip()
                        return  stripped_line
            except FileNotFoundError:
                print("错误: 文件未找到!")
            except Exception as e:
                print(f"读取文件时出现错误: {e}")

if __name__ == '__main__':


    m=strftime("%Y-%m-%d %H:%M:%S", localtime())
    print(m)
