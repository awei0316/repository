# coding=utf-8
import math
import os
from datetime import timedelta
from time import localtime, strftime
from flask import Flask, render_template, request, redirect, json, make_response, jsonify, abort,url_for,session,g,flash
from werkzeug.routing import BaseConverter
import random
from werkzeug.utils import secure_filename
from Lib.busGoods import *
import pandas as pd
import re

class RegexConverter(BaseConverter):
    '''
    自定义转化器类
    '''
    def __init__(self,url_map,regex):
        # 调用父类的方法
        super(RegexConverter,self).__init__(url_map)
        self.regex=regex

    def to_python(self, value):
        # 父类的方法，功能已经实现
        print('to_python')
        return value

app=Flask(import_name=__name__)
#解决中文问题
app.config['JSON_AS_ASCII']=False
# 将自定义的转化器类添加到flask应用中去
app.url_map.converters['re']=RegexConverter
# session 能够使用
app.config['SECRET_KEY'] = 'sdfklas'
app.config['UPLOAD_FOLDER'] = 'static/upload/'


@app.route('/upload')
def upload_file():
    return render_template('upload.html')

@app.route('/uploader',methods=['GET','POST'])
def uploader():
    if request.method == 'POST':
        f = request.files['file']
        fname=request.files['file'].filename
        exefname=fname.split(".")[1]
        p_filename=strftime("%Y%m%d%H%M%S", localtime())+"."+exefname
        f.save(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(p_filename)))

        return render_template('SuccessFile.html', msg="上传成功", p_filename=p_filename)

    else:
        return render_template('upload.html')


# 跳转登录页面
@app.route('/')
def default():
    msg =''
    return  render_template('adminlogin.html',msg=msg)


# 主页
@app.route('/index')
def index():
    return  render_template('index.html')

# 显示欢迎页面
@app.route('/main')
def main():
    if g.spguser:


           return render_template('main.html')





# 请求之前都会调用，将登录信息赋值
@app.before_request
def before_request():
    g.spguser=None
    if 'rdfuno' in session:
        abusGoods = busGoods()
        x_spguser=abusGoods.getspguserbyno(session['rdfuno'])
        g.spguser=x_spguser

# 退出系统
@app.route('/loginout')
def loginout():

        session.clear()
        g.spguser = None
        return render_template('adminlogin.html')


# 登录实现
@app.route('/login',methods=['GET','POST'])
def spguserLogin():
    if request.method=='POST':
        #登录操作
        session.pop('rdfuno',None)
        rdfuno =  request.form.get("txtrdfuno",None)
        rdfups = request.form.get("txtrdfups", None)
        abusGoods=busGoods()
        x_spguser=abusGoods.getspguserLogin(rdfuno,rdfups,"管理员")
        if x_spguser:
            session['rdfuno']=rdfuno
            msg = '登录成功,欢迎进入基于大数据的UniTrade国际贸易平台!'
            gourl = '/index'
            return render_template('Success.html', msg=msg,gourl=gourl)
        else :
            msg='账号或者密码错误'
            return  render_template('adminlogin.html',msg=msg)
    else :
        return redirect(url_for('default'))




# 跳转用户信息增加页面
@app.route('/spguserReg')
def spguserReg():
    return  render_template('spguserReg.html')


# 用户信息增加方法
@app.route('/spguserRegAction',methods=['GET','POST'])
def spguserRegAction():
    if request.method=='POST':
        #读取页面输入的内容操作
        rdfuno =  request.form.get("txtrdfuno",None)
        rdfups = request.form.get("txtrdfups",None)
        rdfuxm = request.form.get("txtrdfuxm", None)
       
        rdfusex = request.form.get("txtrdfusex", None)
        rdfutel = request.form.get("txtrdfutel", None)
        rdfunj = request.form.get("txtrdfunj", None)
        rdftx = request.form.get("txtpic", None)
        rdfurole = "用户"

        x_spguser = {
            "rdfuno": rdfuno,
            "rdfups": rdfups,
            "rdfuxm": rdfuxm,
            "rdfusex": rdfusex,
            "rdfutel": rdfutel,
            "rdfunj": rdfunj,
            "rdfurole": rdfurole,
            "rdftx": rdftx,
        }
        abusGoods = busGoods()
        if  abusGoods.spguserAdd(x_spguser)!=0:

            msg = '用户注册成功'
            gourl= 'spguserReg'
            return render_template('SuccessClose.html', msg=msg,gourl=gourl)
        else :
            gourl = 'spguserReg'
            msg='用户注册失败，用户编号已经存在！'
            return  render_template('Success.html',msg=msg,gourl=gourl)
    else :
        return redirect(url_for('spguserReg'))


# 跳转用户信息增加页面
@app.route('/spguserAdd')
def spguserAdd():
    return render_template('spguserAdd.html')


# 用户信息增加方法
@app.route('/spguserAddAction', methods=['GET', 'POST'])
def spguserAddAction():
    if request.method == 'POST':
        # 读取页面输入的内容操作
        rdfuno = request.form.get("txtrdfuno", None)
        rdfups = request.form.get("txtrdfups", None)
        rdfuxm = request.form.get("txtrdfuxm", None)
        rdfusex = request.form.get("txtrdfusex", None)
        rdfutel = request.form.get("txtrdfutel", None)
        rdfunj = request.form.get("txtrdfunj", None)
        rdftx = request.form.get("txtpic", None)
        rdfurole = request.form.get("txtrdfurole", None)
        x_spguser = {
            "rdfuno": rdfuno,
            "rdfups": rdfups,
            "rdfuxm": rdfuxm,
            "rdfusex": rdfusex,
            "rdfutel": rdfutel,
            "rdfunj": rdfunj,
            "rdfurole": rdfurole,
            "rdftx": rdftx,
        }
        abusGoods = busGoods()
        if abusGoods.spguserAdd(x_spguser) != 0:

            msg = '用户新增成功'
            gourl = 'spguserAdd'
            return render_template('Success.html', msg=msg, gourl=gourl)
        else:
            gourl = 'spguserAdd'
            msg = '用户新增失败，用户编号已经存在！'
            return render_template('Success.html', msg=msg, gourl=gourl)
    else:
        return redirect(url_for('spguserAdd'))


# 跳转用户信息增加页面
@app.route('/qspguserAdd')
def qspguserAdd():
    return render_template('qspguserAdd.html')


# 用户信息增加方法
@app.route('/qspguserAddAction', methods=['GET', 'POST'])
def qspguserAddAction():
    if request.method == 'POST':
        # 读取页面输入的内容操作
        rdfuno = request.form.get("txtrdfuno", None)
        rdfups = request.form.get("txtrdfups", None)
        rdfuxm = request.form.get("txtrdfuxm", None)

        rdfusex = request.form.get("txtrdfusex", None)
        rdfutel = request.form.get("txtrdfutel", None)
        rdfunj = request.form.get("txtrdfunj", None)
        rdftx = request.form.get("txtpic", None)
        rdfurole = "用户"

        x_spguser = {
            "rdfuno": rdfuno,
            "rdfups": rdfups,
            "rdfuxm": rdfuxm,
            "rdfusex": rdfusex,
            "rdfutel": rdfutel,
            "rdfunj": rdfunj,
            "rdfurole": rdfurole,
            "rdftx": rdftx,
        }
        abusGoods = busGoods()
        if abusGoods.spguserAdd(x_spguser) != 0:

            msg = '用户注册成功'
            gourl = 'qspguserAdd'
            return render_template('Success.html', msg=msg, gourl=gourl)
        else:
            gourl = 'qspguserAdd'
            msg = '用户注册失败，用户编号已经存在！'
            return render_template('Success.html', msg=msg, gourl=gourl)
    else:
        return redirect(url_for('qspguserAdd'))



# 查询用户信息
@app.route('/spguserList',methods=['GET','POST'])
def spguserList():
    # 读取页面传递过来的当前页面
    #每页的条数
    pageSize=18
    #读取页面条件
    index = request.args.get('index')
    rdfuno = request.form.get('txtrdfuno')
    rdfuxm = request.form.get('txtrdfuxm')
    rdfunj = request.form.get('txtrdfunj')
    # 生成查询条件语句
    stwhe = "   "
    if rdfuno:
        if rdfuno != "":
            stwhe += " and rdfuno  like '%" + rdfuno + "%'"
    else:
        rdfuno = ""

    if rdfuxm:
        if rdfuxm != "":
            stwhe += " and rdfuxm  like '%" + rdfuxm + "%'"
    else:
        rdfuxm = ""

    if rdfunj:
        if rdfunj != "":
            stwhe += " and rdfunj  like '%" + rdfunj + "%'"
    else:
        rdfunj = ""

    #查询总页数
    abusGoods = busGoods()
    dtstub = abusGoods.getspguserlist(stwhe)  # 查询用户信息
    pages=1
    nowindex=1
    stu_data=[]
    x_cons={
        "rdfuno":rdfuno,
        "rdfuxm": rdfuxm,
        "rdfunj": rdfunj,
    }

    if dtstub:
        zcount=len(dtstub)  # 总记录
        # 计算总页数
        pages=math.ceil(zcount/pageSize)
        index=int(index)

        if index <= 0:
           index = 1
        if index >pages:
           index = 1
        nowindex=index
        fromIndex = (index - 1) * pageSize
        #分页数据
        dtstub_fy = abusGoods.getspguserlistPage(stwhe,fromIndex,pageSize)  # 分页查询用户信息
        if dtstub_fy:
            for row, it_dtstub in enumerate(dtstub_fy):
                dstupa  = {}
                dstupa['id']=it_dtstub[0]
                dstupa['rdfuno'] = it_dtstub[1]
                dstupa['rdfups'] = it_dtstub[2]
                dstupa['rdfuxm'] = it_dtstub[3]
                dstupa['rdfusex'] = it_dtstub[4]
                dstupa['rdfutel'] = it_dtstub[5]
                dstupa['rdfunj'] = it_dtstub[6]
                dstupa['rdfurole'] = it_dtstub[7]
                dstupa['rdftx'] = it_dtstub[8]

                stu_data.append(dstupa)
        else :
            pages=0
    return render_template('spguserList.html',data=stu_data,index=nowindex,pages=pages,cons=x_cons)


# 用户信息删除
@app.route('/spguserDel',methods=['GET','POST'])
def spguserDel():
    index = request.args.get('index')
    dstupaids = request.form.get('txtRidfBookids')
    dstupaids=dstupaids.replace('|',"")
    dstupaids=dstupaids.split(",")
    for apid in dstupaids:
        if apid:
            id=int(apid)
            abusGoods = busGoods()
            #彻底删除用户信息
            abusGoods.spguserDel(id)

    gourl = 'spguserList?index='+index
    msg = '用户信息删除成功'
    return render_template('Success.html', msg=msg, gourl=gourl)

# 跳转用户信息修改页面
@app.route('/spguserUpdate')
def spguserUpdate():
    abusGoods = busGoods()
    id = request.args.get('id')
    index = request.args.get('index')
    data = abusGoods.getspguserbyid(id)  # 查询用户信息

    return render_template('spguserUpdate.html', data=data, index=index,id=id)
# 用户信息修改方法
@app.route('/spguserUpdateAction',methods=['GET','POST'])
def spguserUpdateAction():
    if request.method=='POST':


        #读取页面输入的内容操作
        id = request.args.get('id')
        index = request.args.get('index')

        rdfuxm = request.form.get("txtrdfuxm", None)

        rdfusex = request.form.get("txtrdfusex", None)
        rdfutel = request.form.get("txtrdfutel", None)
        rdfunj = request.form.get("txtrdfunj", None)
        rdftx = request.form.get("txtpic", None)

        x_spguser = {


            "rdfuxm": rdfuxm,
            "rdfusex": rdfusex,
            "rdfutel": rdfutel,
            "rdfunj": rdfunj,
            "rdftx": rdftx,

            "id": id,

        }
        abusGoods = busGoods()
        if  abusGoods.spguserUpdate(x_spguser):

            msg = '用户修改成功'
            gourl = 'spguserList?index=' + index
            return render_template('Success.html', msg=msg,gourl=gourl)
        else :

            msg='用户修改失败！'
            gourl = 'spguserList?index=' + index
            return  render_template('Success.html',msg=msg,gourl=gourl)
    else :
        return redirect(url_for('spguserList', index=1))


# 跳转用户信息修改页面
@app.route('/spguserUpdateMy')
def spguserUpdateMy():
    abusGoods = busGoods()
    id = g.spguser.get('id')
    index = request.args.get('index')
    data = abusGoods.getspguserbyid(id)  # 查询用户信息

    return render_template('spguserUpdateMy.html', data=data, index=index,id=id)
# 用户信息修改方法
@app.route('/spguserUpdateMyAction',methods=['GET','POST'])
def spguserUpdateMyAction():
    if request.method=='POST':


        #读取页面输入的内容操作
        id = g.spguser.get('id')


        rdfuxm = request.form.get("txtrdfuxm", None)

        rdfusex = request.form.get("txtrdfusex", None)
        rdfutel = request.form.get("txtrdfutel", None)
        rdfunj = request.form.get("txtrdfunj", None)
        rdftx = request.form.get("txtpic", None)

        x_spguser = {


            "rdfuxm": rdfuxm,
            "rdfusex": rdfusex,
            "rdfutel": rdfutel,
            "rdfunj": rdfunj,
            "rdftx": rdftx,

            "id": id,

        }
        abusGoods = busGoods()
        if  abusGoods.spguserUpdate(x_spguser):

            msg = '用户修改成功'
            gourl = 'spguserUpdateMy'
            return render_template('Success.html', msg=msg,gourl=gourl)
        else :

            msg='用户修改失败！'
            gourl = 'spguserUpdateMy'
            return  render_template('Success.html',msg=msg,gourl=gourl)
    else :
        return redirect(url_for('spguserUpdateMy', index=1))



# 跳转密码修改页面
@app.route('/spguserPass')
def spguserPass():
    return render_template('spguserPass.html')

# 密码修改方法
@app.route('/spguserPassAction',methods=['GET','POST'])
def spguserPassAction():
    if request.method=='POST':
        #读取页面输入的内容操作
        id = g.spguser.get('id')
        rdfups = request.form.get("txtrdfups", None)
        x_spguser = {

            "rdfups": rdfups,
            "id":id,

        }
        abusGoods = busGoods()
        if abusGoods.spguserPassUpdate(x_spguser):
            gourl = 'spguserPass'
            msg = '密码修改成功'
            return render_template('Success.html', msg=msg, gourl=gourl)
        else :
            gourl = 'spguserPass'
            msg = '密码修改失败'
            return render_template('Success.html', msg=msg, gourl=gourl)
    else :
        return redirect(url_for('default'))

  


# 查询信息
@app.route('/spggoodList', methods=['GET', 'POST'])
def spggoodList():
    # 读取页面传递过来的当前页面
    # 每页的条数
    pageSize = 10
    # 读取页面条件
    index = request.args.get('index')
    rdfpro = request.form.get("rdfpro", None)
    rdfcity = request.form.get("rdfcity", None)

    rdftnm = request.form.get("rdftnm", None)
    rdfjnm = request.form.get("rdfjnm", None)
    rdfbwz = request.form.get("rdfbwz", None)


    # 生成查询条件语句
    stwhe = "  "

    if rdfpro:
        if rdfpro != "":
            stwhe += " and rdfpro  like '%" + rdfpro + "%'"
    else:
        rdfpro = ""

    if rdfcity:
        if rdfcity != "":
            stwhe += " and rdfcity  like '%" + rdfcity + "%'"
    else:
        rdfcity = ""

    if rdftnm:
        if rdftnm != "":
            stwhe += " and rdftnm  like '%" + rdftnm + "%'"
    else:
        rdftnm = ""

    if rdfjnm:
        if rdfjnm != "":
            stwhe += " and rdfjnm  like '%" + rdfjnm + "%'"
    else:
        rdfjnm = ""
    if rdfbwz:
        if rdfbwz != "":
            stwhe += " and rdfbwz  like '%" + rdfbwz + "%'"
    else:
        rdfbwz = ""



    # 查询总页数
    abusGoods = busGoods()
    dtstub = abusGoods.getspggoodlist(stwhe)  # 查询信息
    pages = 1
    nowindex = 1
    stu_data = []
    x_cons = {
        "rdfpro": rdfpro,
        "rdfcity": rdfcity,

        "rdftnm": rdftnm,
        "rdfjnm": rdfjnm,
        "rdfbwz": rdfbwz,


    }

    if dtstub:
        zcount = len(dtstub)  # 总记录
        # 计算总页数
        pages = math.ceil(zcount / pageSize)
        index = int(index)

        if index <= 0:
            index = 1
        if index > pages:
            index = 1
        nowindex = index
        fromIndex = (index - 1) * pageSize
        # 分页数据
        dtstub_fy = abusGoods.getspggoodlistPage(stwhe, fromIndex, pageSize)  # 分页查询信息
        if dtstub_fy:
            for row, it_dtstub in enumerate(dtstub_fy):
                dstupa = {}
                dstupa['id'] = it_dtstub[0]
                dstupa['rdfbno'] = it_dtstub[1]
                dstupa['rdfbsm'] = it_dtstub[2]
                dstupa['rdfbzz'] = it_dtstub[3]
                dstupa['rdfbcbs'] = it_dtstub[4]
                dstupa['rdftnm'] = it_dtstub[5]
                dstupa['rdfjnm'] = it_dtstub[6]
                dstupa['rdfbwz'] = it_dtstub[7]

                dstupa['rdfjiage'] = it_dtstub[8]
                dstupa['rdfbzt'] = it_dtstub[9]

                dstupa['rdfpro'] = it_dtstub[10]
                dstupa['rdfcity'] = it_dtstub[11]
                dstupa['rdfpic'] = it_dtstub[12]
                dstupa['rdftype'] = it_dtstub[13]

                stu_data.append(dstupa)
        else:
            pages = 0

    return render_template('spggoodList.html', data=stu_data, index=nowindex, pages=pages, cons=x_cons )





# 查询信息
@app.route('/spggoodListLook', methods=['GET', 'POST'])
def spggoodListLook():
    # 读取页面传递过来的当前页面
    # 每页的条数
    pageSize = 10
    # 读取页面条件
    index = request.args.get('index')
    rdfpro = request.form.get("rdfpro", None)
    rdfcity = request.form.get("rdfcity", None)

    rdftnm = request.form.get("rdftnm", None)
    rdfjnm = request.form.get("rdfjnm", None)
    rdfbwz = request.form.get("rdfbwz", None)

    # 生成查询条件语句
    stwhe = "  "

    if rdfpro:
        if rdfpro != "":
            stwhe += " and rdfpro  like '%" + rdfpro + "%'"
    else:
        rdfpro = ""

    if rdfcity:
        if rdfcity != "":
            stwhe += " and rdfcity  like '%" + rdfcity + "%'"
    else:
        rdfcity = ""

    if rdftnm:
        if rdftnm != "":
            stwhe += " and rdftnm  like '%" + rdftnm + "%'"
    else:
        rdftnm = ""

    if rdfjnm:
        if rdfjnm != "":
            stwhe += " and rdfjnm  like '%" + rdfjnm + "%'"
    else:
        rdfjnm = ""
    if rdfbwz:
        if rdfbwz != "":
            stwhe += " and rdfbwz  like '%" + rdfbwz + "%'"
    else:
        rdfbwz = ""

    # 查询总页数
    abusGoods = busGoods()
    dtstub = abusGoods.getspggoodlist(stwhe)  # 查询信息
    pages = 1
    nowindex = 1
    stu_data = []
    x_cons = {
        "rdfpro": rdfpro,
        "rdfcity": rdfcity,

        "rdftnm": rdftnm,
        "rdfjnm": rdfjnm,
        "rdfbwz": rdfbwz,

    }

    if dtstub:
        zcount = len(dtstub)  # 总记录
        # 计算总页数
        pages = math.ceil(zcount / pageSize)
        index = int(index)

        if index <= 0:
            index = 1
        if index > pages:
            index = 1
        nowindex = index
        fromIndex = (index - 1) * pageSize
        # 分页数据
        dtstub_fy = abusGoods.getspggoodlistPage(stwhe, fromIndex, pageSize)  # 分页查询信息
        if dtstub_fy:
            for row, it_dtstub in enumerate(dtstub_fy):
                dstupa = {}
                dstupa['id'] = it_dtstub[0]
                dstupa['rdfbno'] = it_dtstub[1]
                dstupa['rdfbsm'] = it_dtstub[2]
                dstupa['rdfbzz'] = it_dtstub[3]
                dstupa['rdfbcbs'] = it_dtstub[4]
                dstupa['rdftnm'] = it_dtstub[5]
                dstupa['rdfjnm'] = it_dtstub[6]
                dstupa['rdfbwz'] = it_dtstub[7]

                dstupa['rdfjiage'] = it_dtstub[8]
                dstupa['rdfbzt'] = it_dtstub[9]

                dstupa['rdfpro'] = it_dtstub[10]
                dstupa['rdfcity'] = it_dtstub[11]
                dstupa['rdfpic'] = it_dtstub[12]
                dstupa['rdftype'] = it_dtstub[13]

                stu_data.append(dstupa)
        else:
            pages = 0

    return render_template('spggoodListLook.html', data=stu_data, index=nowindex, pages=pages, cons=x_cons )



# 查询信息
@app.route('/spggoodListPiao', methods=['GET', 'POST'])
def spggoodListPiao():

    stu_data = []

    abusGoods = busGoods()
    dtstub_fy = abusGoods.getspggoodlistPageX("", 1, 15)  # 分页查询信息
    if dtstub_fy:
        for row, it_dtstub in enumerate(dtstub_fy):
            dstupa = {}
            dstupa['id'] = it_dtstub[0]
            dstupa['rdfbno'] = it_dtstub[1]
            dstupa['rdfbsm'] = it_dtstub[2]
            dstupa['rdfbzz'] = it_dtstub[3]
            dstupa['rdfbcbs'] = it_dtstub[4]
            dstupa['rdftnm'] = it_dtstub[5]
            dstupa['rdfjnm'] = it_dtstub[6]
            dstupa['rdfbwz'] = it_dtstub[7]

            dstupa['rdfjiage'] = it_dtstub[8]
            dstupa['rdfbzt'] = it_dtstub[9]

            dstupa['rdfpro'] = it_dtstub[10]
            dstupa['rdfcity'] = it_dtstub[11]
            dstupa['rdfpic'] = it_dtstub[12]
            dstupa['rdftype'] = it_dtstub[13]

            stu_data.append(dstupa)


    return render_template('spggoodListPiao.html', data=stu_data  )


# 查询信息
@app.route('/spggoodListRe', methods=['GET', 'POST'])
def spggoodListRe():

    stu_data = []

    abusGoods = busGoods()
    dtstub_fy = abusGoods.getspggoodlistPageY("", 1, 15)  # 分页查询信息
    if dtstub_fy:
        for row, it_dtstub in enumerate(dtstub_fy):
            dstupa = {}
            dstupa['id'] = it_dtstub[0]
            dstupa['rdfbno'] = it_dtstub[1]
            dstupa['rdfbsm'] = it_dtstub[2]
            dstupa['rdfbzz'] = it_dtstub[3]
            dstupa['rdfbcbs'] = it_dtstub[4]
            dstupa['rdftnm'] = it_dtstub[5]
            dstupa['rdfjnm'] = it_dtstub[6]
            dstupa['rdfbwz'] = it_dtstub[7]

            dstupa['rdfjiage'] = it_dtstub[8]
            dstupa['rdfbzt'] = it_dtstub[9]

            dstupa['rdfpro'] = it_dtstub[10]
            dstupa['rdfcity'] = it_dtstub[11]
            dstupa['rdfpic'] = it_dtstub[12]
            dstupa['rdftype'] = it_dtstub[13]

            stu_data.append(dstupa)


    return render_template('spggoodListRe.html', data=stu_data  )





# 查询
@app.route('/CX1')
def CX1():
    df = pd.read_excel("data/进出口贸易额.xls")
    stu_data=[]
    for index, row in df.iterrows():
        dstupa = {}
        dstupa['zd'] = row[0]
        dstupa['cnt'] = row[1]
        stu_data.append(dstupa)
    return render_template('CX1.html', data=stu_data  )# 查询
@app.route('/CX2')
def CX2():
    df = pd.read_excel("data/进出口商品关别总值.xls")
    total_by_guan = df.groupby('关别')['进出口总值'].sum().reset_index()
    total_by_guan = total_by_guan.sort_values('进出口总值', ascending=False)

    stu_data = []
    for index, row in total_by_guan.iterrows():
        dstupa = {}
        dstupa['zd'] = row[0]
        dstupa['cnt'] = row[1]
        stu_data.append(dstupa)


    return render_template('CX2.html', data=stu_data  )


# 进出口商品关别总值
@app.route('/CX2_2', methods=['GET', 'POST'])
def CX2_2():
    df = pd.read_excel('data/进出口商品关别总值.xls')

    guan = request.form.get('guan', "北京海关")

    # 构建查询条件
    query_conditions = []

    if guan:
        # 转义特殊字符，防止正则表达式注入
        escaped_guan = re.escape(guan)
        # 使用str.contains实现模糊查询
        query_conditions.append(f"关别.str.contains('{escaped_guan}', na=False)")
    QSquadWh = { "guan": guan}
        # 组合查询条件
    if query_conditions:
        query_str = ' and '.join(query_conditions)
        filtered_df = df.query(query_str)
    else:
        filtered_df = df.copy()
    filtered_df = filtered_df.sort_values('年份', ascending=True)
    filtered_df = filtered_df.sort_values('月份', ascending=True)
    stu_data=[]
    for index, row in filtered_df.iterrows():
        dstupa = {}
        dstupa['zd'] = str(row[1])+"年"+ str(row[2])+"月"
        dstupa['cnt'] = row[4]
        stu_data.append(dstupa)

    return render_template('CX2_2.html', data=stu_data,
                           cons=QSquadWh)


# 进出口商品关别总值
@app.route('/CX2_3', methods=['GET', 'POST'])
def CX2_3():
    df = pd.read_excel('data/进出口商品关别总值.xls')

    guan = request.form.get('guan', "北京海关")

    # 构建查询条件
    query_conditions = []

    if guan:
        # 转义特殊字符，防止正则表达式注入
        escaped_guan = re.escape(guan)
        # 使用str.contains实现模糊查询
        query_conditions.append(f"关别.str.contains('{escaped_guan}', na=False)")
    QSquadWh = { "guan": guan}
        # 组合查询条件
    if query_conditions:
        query_str = ' and '.join(query_conditions)
        filtered_df = df.query(query_str)
    else:
        filtered_df = df.copy()
    filtered_df = filtered_df.sort_values('年份', ascending=True)
    filtered_df = filtered_df.sort_values('月份', ascending=True)
    stu_data=[]
    for index, row in filtered_df.iterrows():
        dstupa = {}
        dstupa['zd'] = str(row[1])+"年"+ str(row[2])+"月"
        dstupa['cnt'] = row[3]
        stu_data.append(dstupa)

    return render_template('CX2_3.html', data=stu_data,
                           cons=QSquadWh)







# 查询
@app.route('/CX3')
def CX3():
    df = pd.read_excel("data/特定地区进出口总值.xls")
    df['进出口总值'] = pd.to_numeric(df['进出口总值'], errors='coerce').fillna(0)
    total_by_guan = df.groupby('特定经济地区')['进出口总值'].sum().reset_index()
    total_by_guan = total_by_guan.sort_values('进出口总值', ascending=False)

    stu_data = []
    for index, row in total_by_guan.iterrows():
        dstupa = {}
        dstupa['zd'] = row[0]
        dstupa['cnt'] = row[1]
        stu_data.append(dstupa)


    return render_template('CX3.html', data=stu_data  )




# 进出口商品关别总值
@app.route('/CX3_2', methods=['GET', 'POST'])
def CX3_2():
    df = pd.read_excel("data/特定地区进出口总值.xls")
    df['进口总值'] = pd.to_numeric(df['进口总值'], errors='coerce').fillna(0)

    guan = request.form.get('guan', "厦门经济特区")

    # 构建查询条件
    query_conditions = []

    if guan:
        # 转义特殊字符，防止正则表达式注入
        escaped_guan = re.escape(guan)
        # 使用str.contains实现模糊查询
        query_conditions.append(f"特定经济地区.str.contains('{escaped_guan}', na=False)")
    QSquadWh = { "guan": guan}
        # 组合查询条件
    if query_conditions:
        query_str = ' and '.join(query_conditions)
        filtered_df = df.query(query_str)
    else:
        filtered_df = df.copy()
    filtered_df = filtered_df.sort_values('年份', ascending=True)
    filtered_df = filtered_df.sort_values('月份', ascending=True)
    stu_data=[]
    for index, row in filtered_df.iterrows():
        dstupa = {}
        dstupa['zd'] = str(row[1])+"年"+ str(row[2])+"月"
        dstupa['cnt'] = row[4]
        stu_data.append(dstupa)

    return render_template('CX3_2.html', data=stu_data,
                           cons=QSquadWh)


# 进出口商品关别总值
@app.route('/CX3_3', methods=['GET', 'POST'])
def CX3_3():
    df = pd.read_excel("data/特定地区进出口总值.xls")
    df['出口总值'] = pd.to_numeric(df['出口总值'], errors='coerce').fillna(0)



    guan = request.form.get('guan', "厦门经济特区")

    # 构建查询条件
    query_conditions = []

    if guan:
        # 转义特殊字符，防止正则表达式注入
        escaped_guan = re.escape(guan)
        # 使用str.contains实现模糊查询
        query_conditions.append(f"特定经济地区.str.contains('{escaped_guan}', na=False)")
    QSquadWh = { "guan": guan}
        # 组合查询条件
    if query_conditions:
        query_str = ' and '.join(query_conditions)
        filtered_df = df.query(query_str)
    else:
        filtered_df = df.copy()
    filtered_df = filtered_df.sort_values('年份', ascending=True)
    filtered_df = filtered_df.sort_values('月份', ascending=True)
    stu_data=[]
    for index, row in filtered_df.iterrows():
        dstupa = {}
        dstupa['zd'] = str(row[1])+"年"+ str(row[2])+"月"
        dstupa['cnt'] = row[4]
        stu_data.append(dstupa)

    return render_template('CX3_3.html', data=stu_data,
                           cons=QSquadWh)



@app.route('/spggoodDetail')
def spggoodDetail():

    x_busGoods = busGoods()

    text = x_busGoods.read_file_content_line_by_line("data/tag.txt")
    x1, x2  = text.split("|")
    #x1 = "{:.2f}%".format(float(x1) * 100)



    return render_template('spggoodDetail.html', score=x1,rmse=x2  )
# 跳转密码修改页面
@app.route('/CX5')
def CX5():
    return render_template('CX5.html')
# 跳转密码修改页面
@app.route('/CX6')
def CX6():
    return render_template('CX6.html')





@app.route('/yanyuanAdd')
def yanyuanAdd():
    return render_template('yanyuanAdd.html')


# 用户信息增加方法
@app.route('/yanyuanAddAction', methods=['GET', 'POST'])
def yanyuanAddAction():
    if request.method == 'POST':
        # 读取页面输入的内容操作
        dybt = request.form.get("dybt", None)
        dycon = request.form.get("dycon", None)

        addtime = strftime("%Y-%m-%d %H:%M:%S", localtime())
        dyhon = ""
        haddtime = ""
        rdfuno = g.spguser.get("rdfuno")
        rdfuxm = g.spguser.get("rdfuxm")


        x_yanyuan = {
            "dybt": dybt,
            "dycon": dycon,
            "addtime": addtime,
            "dyhon": dyhon,
            "haddtime": haddtime,
            "rdfuno": rdfuno,
            "rdfuxm": rdfuxm,

        }
        abusGoods = busGoods()
        if abusGoods.yanyuanAdd(x_yanyuan) != 0:

            msg = '用户在线咨询提交成功'
            gourl = 'yanyuanAdd'
            return render_template('Success.html', msg=msg, gourl=gourl)
        else:
            gourl = 'yanyuanAdd'
            msg = '用户在线咨询提交失败！'
            return render_template('Success.html', msg=msg, gourl=gourl)
    else:
        return redirect(url_for('yanyuanAdd'))


@app.route('/yanyuanList',methods=['GET','POST'])
def yanyuanList():
    # 读取页面传递过来的当前页面
    #每页的条数
    pageSize=18
    #读取页面条件
    index = request.args.get('index')
    dybt = request.form.get('dybt')
    rdfuno = request.form.get('rdfuno')
    rdfuxm = request.form.get('rdfuxm')
    # 生成查询条件语句
    stwhe = "   "
    if dybt:
        if dybt != "":
            stwhe += " and dybt  like '%" + dybt + "%'"
    else:
        dybt = ""

    if rdfuno:
        if rdfuno != "":
            stwhe += " and rdfuno  like '%" + rdfuno + "%'"
    else:
        rdfuno = ""

    if rdfuxm:
        if rdfuxm != "":
            stwhe += " and rdfuxm  like '%" + rdfuxm + "%'"
    else:
        rdfuxm = ""

    #查询总页数
    abusGoods = busGoods()
    dtstub = abusGoods.getyanyuanlist(stwhe)  # 查询用户信息
    pages=1
    nowindex=1
    stu_data=[]
    x_cons={
        "dybt":dybt,
        "rdfuno": rdfuno,
        "rdfuxm": rdfuxm,
    }

    if dtstub:
        zcount=len(dtstub)  # 总记录
        # 计算总页数
        pages=math.ceil(zcount/pageSize)
        index=int(index)

        if index <= 0:
           index = 1
        if index >pages:
           index = 1
        nowindex=index
        fromIndex = (index - 1) * pageSize
        #分页数据
        dtstub_fy = abusGoods.getyanyuanlistPage(stwhe,fromIndex,pageSize)  # 分页查询用户信息
        if dtstub_fy:
            for row, it_dtstub in enumerate(dtstub_fy):
                dstupa  = {}
                dstupa['id']=it_dtstub[0]
                dstupa['dybt'] = it_dtstub[1]
                dstupa['dycon'] = it_dtstub[2]
                dstupa['addtime'] = it_dtstub[3]
                dstupa['dyhon'] = it_dtstub[4]
                dstupa['haddtime'] = it_dtstub[5]
                dstupa['rdfuno'] = it_dtstub[6]
                dstupa['rdfuxm'] = it_dtstub[7]


                stu_data.append(dstupa)
        else :
            pages=0
    return render_template('yanyuanList.html',data=stu_data,index=nowindex,pages=pages,cons=x_cons)


# 用户信息删除
@app.route('/yanyuanDel',methods=['GET','POST'])
def yanyuanDel():
    index = request.args.get('index')
    dstupaids = request.form.get('txtRidfBookids')
    dstupaids=dstupaids.replace('|',"")
    dstupaids=dstupaids.split(",")
    for apid in dstupaids:
        if apid:
            id=int(apid)
            abusGoods = busGoods()

            abusGoods.yanyuanDel(id)

    gourl = 'yanyuanList?index='+index
    msg = '在线咨询删除成功'
    return render_template('Success.html', msg=msg, gourl=gourl)

@app.route('/yanyuanListMy',methods=['GET','POST'])
def yanyuanListMy():
    # 读取页面传递过来的当前页面
    #每页的条数
    pageSize=18
    #读取页面条件
    index = request.args.get('index')
    dybt = request.form.get('dybt')
    rdfuno = g.spguser.get('rdfuno')

    # 生成查询条件语句
    stwhe = "   "
    if dybt:
        if dybt != "":
            stwhe += " and dybt  like '%" + dybt + "%'"
    else:
        dybt = ""

    if rdfuno:
        if rdfuno != "":
            stwhe += " and rdfuno  like '%" + rdfuno + "%'"
    else:
        rdfuno = ""



    #查询总页数
    abusGoods = busGoods()
    dtstub = abusGoods.getyanyuanlist(stwhe)  # 查询用户信息
    pages=1
    nowindex=1
    stu_data=[]
    x_cons={
        "dybt":dybt,
        "rdfuno": rdfuno,

    }

    if dtstub:
        zcount=len(dtstub)  # 总记录
        # 计算总页数
        pages=math.ceil(zcount/pageSize)
        index=int(index)

        if index <= 0:
           index = 1
        if index >pages:
           index = 1
        nowindex=index
        fromIndex = (index - 1) * pageSize
        #分页数据
        dtstub_fy = abusGoods.getyanyuanlistPage(stwhe,fromIndex,pageSize)  # 分页查询用户信息
        if dtstub_fy:
            for row, it_dtstub in enumerate(dtstub_fy):
                dstupa  = {}
                dstupa['id']=it_dtstub[0]
                dstupa['dybt'] = it_dtstub[1]
                dstupa['dycon'] = it_dtstub[2]
                dstupa['addtime'] = it_dtstub[3]
                dstupa['dyhon'] = it_dtstub[4]
                dstupa['haddtime'] = it_dtstub[5]
                dstupa['rdfuno'] = it_dtstub[6]
                dstupa['rdfuxm'] = it_dtstub[7]


                stu_data.append(dstupa)
        else :
            pages=0
    return render_template('yanyuanListMy.html',data=stu_data,index=nowindex,pages=pages,cons=x_cons)


# 用户信息删除
@app.route('/yanyuanDelMy',methods=['GET','POST'])
def yanyuanDelMy():
    index = request.args.get('index')
    dstupaids = request.form.get('txtRidfBookids')
    dstupaids=dstupaids.replace('|',"")
    dstupaids=dstupaids.split(",")
    for apid in dstupaids:
        if apid:
            id=int(apid)
            abusGoods = busGoods()

            abusGoods.yanyuanDel(id)

    gourl = 'yanyuanListMy?index='+index
    msg = '在线咨询删除成功'
    return render_template('Success.html', msg=msg, gourl=gourl)



@app.route('/yanyuanUpdate')
def yanyuanUpdate():
    abusGoods = busGoods()
    id = request.args.get('id')

    data = abusGoods.getyanyuanbyid(id)  # 查询用户信息

    return render_template('yanyuanUpdate.html', data=data, index=index,id=id)
# 用户信息修改方法
@app.route('/yanyuanUpdateAction',methods=['GET','POST'])
def yanyuanUpdateAction():
    if request.method=='POST':


        #读取页面输入的内容操作
        id = request.args.get('id')
        dyhon = request.form.get("dyhon", None)
        haddtime = strftime("%Y-%m-%d %H:%M:%S", localtime())

        x_yanyuan = {


            "dyhon": dyhon,
            "haddtime": haddtime,


            "id": id,

        }
        abusGoods = busGoods()
        if  abusGoods.yanyuanUpdate(x_yanyuan):

            msg = '在线咨询回复成功'

            return render_template('SuccessClose.html', msg=msg )
        else :

            msg='在线咨询回复失败！'

            return  render_template('SuccessClose.html',msg=msg )
    else :
        return redirect(url_for('yanyuanList', index=1))


# 进出口贸易额
@app.route('/AList', methods=['GET', 'POST'])
def AList():
    df = pd.read_excel('data/进出口贸易额.xls')
    year  = request.form.get('year', "")
    # 每页的记录数量,当前页码、总页数
    pageSize, index, pages = 10, int(request.args.get('index')), 1
    # 构建查询条件
    query_conditions = []
    if year:
        query_conditions.append(f"年份 == {year}")

        # 组合查询条件
    if query_conditions:
        query_str = ' and '.join(query_conditions)
        filtered_df = df.query(query_str)
    else:
        filtered_df = df.copy()
    # 计算分页信息
    total_records = len(filtered_df)
    pages = (total_records + pageSize - 1) // pageSize

    # 分页数据
    start_idx = (index - 1) * pageSize
    end_idx = min(start_idx + pageSize, total_records)
    paginated_data = filtered_df.iloc[start_idx:end_idx].to_dict('records')

    QSquadWh = {"year": year}
    DTSquad = []
    #亿元人民币
    if paginated_data:

        for row in paginated_data:
            pamSquad = {}
            pamSquad["年份"] = row["年份"]
            pamSquad["进出口贸易额"] = str(row["进出口贸易额"])+"亿元人民币"
            DTSquad.append(pamSquad)
    else:
        pages = 0
    return render_template('AList.html', data=DTSquad, index=index, pages=pages,
                           cons=QSquadWh)

# 进出口商品关别总值
@app.route('/BList', methods=['GET', 'POST'])
def BList():
    df = pd.read_excel('data/进出口商品关别总值.xls')
    year  = request.form.get('year', "")
    guan = request.form.get('guan', "")
    # 每页的记录数量,当前页码、总页数
    pageSize, index, pages = 10, int(request.args.get('index')), 1
    # 构建查询条件
    query_conditions = []
    if year:
        query_conditions.append(f"年份 == {year}")
    if guan:
        # 转义特殊字符，防止正则表达式注入
        escaped_guan = re.escape(guan)
        # 使用str.contains实现模糊查询
        query_conditions.append(f"关别.str.contains('{escaped_guan}', na=False)")

        # 组合查询条件
    if query_conditions:
        query_str = ' and '.join(query_conditions)
        filtered_df = df.query(query_str)
    else:
        filtered_df = df.copy()
    # 计算分页信息
    total_records = len(filtered_df)
    pages = (total_records + pageSize - 1) // pageSize

    # 分页数据
    start_idx = (index - 1) * pageSize
    end_idx = min(start_idx + pageSize, total_records)
    paginated_data = filtered_df.iloc[start_idx:end_idx].to_dict('records')

    QSquadWh = {"year": year,"guan": guan}
    DTSquad = []
    #亿元人民币
    if paginated_data:

        for row in paginated_data:
            pamSquad = {}
            pamSquad["关别"] = row["关别"]
            pamSquad["年份"] = row["年份"]
            pamSquad["月份"] = row["月份"]
            pamSquad["出口总值"] =  str(row["出口总值"])+"亿元人民币"
            pamSquad["进口总值"] = str(row["进口总值"])+"亿元人民币"
            pamSquad["进出口总值"] = str(row["进出口总值"])+"亿元人民币"
            DTSquad.append(pamSquad)
    else:
        pages = 0
    return render_template('BList.html', data=DTSquad, index=index, pages=pages,
                           cons=QSquadWh)

# 进出口商品关别总值
@app.route('/CList', methods=['GET', 'POST'])
def CList():
    df = pd.read_excel('data/特定地区进出口总值.xls')
    year  = request.form.get('year', "")
    guan = request.form.get('guan', "")
    # 每页的记录数量,当前页码、总页数
    pageSize, index, pages = 10, int(request.args.get('index')), 1
    # 构建查询条件
    query_conditions = []
    if year:
        query_conditions.append(f"年份 == {year}")
    if guan:
        # 转义特殊字符，防止正则表达式注入
        escaped_guan = re.escape(guan)
        # 使用str.contains实现模糊查询
        query_conditions.append(f"特定经济地区.str.contains('{escaped_guan}', na=False)")

        # 组合查询条件
    if query_conditions:
        query_str = ' and '.join(query_conditions)
        filtered_df = df.query(query_str)
    else:
        filtered_df = df.copy()
    # 计算分页信息
    total_records = len(filtered_df)
    pages = (total_records + pageSize - 1) // pageSize

    # 分页数据
    start_idx = (index - 1) * pageSize
    end_idx = min(start_idx + pageSize, total_records)
    paginated_data = filtered_df.iloc[start_idx:end_idx].to_dict('records')

    QSquadWh = {"year": year,"guan": guan}
    DTSquad = []
    #亿元人民币
    if paginated_data:

        for row in paginated_data:
            pamSquad = {}
            pamSquad["特定经济地区"] = row["特定经济地区"]
            pamSquad["年份"] = row["年份"]
            pamSquad["月份"] = row["月份"]
            pamSquad["出口总值"] =  str(row["出口总值"])+"亿元人民币"
            pamSquad["进口总值"] = str(row["进口总值"])+"亿元人民币"
            pamSquad["进出口总值"] = str(row["进出口总值"])+"亿元人民币"
            DTSquad.append(pamSquad)
    else:
        pages = 0
    return render_template('CList.html', data=DTSquad, index=index, pages=pages,
                           cons=QSquadWh)


if __name__ == '__main__':
    app.run(host="0.0.0.0",debug=True, port=8081)
