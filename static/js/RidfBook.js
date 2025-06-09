/*定义窗口颜色*/
var q_color = "font-size:16px;background:#1296db;color:#000; text-align: left;";
var q_title = "系统提示窗";
/*提示窗口---增加修改等跳转**/
function RidfBookAlertMsg(title, url) {
    layer.alert(title, { title: [q_title, q_color] }, function () {
        window.location.href = url;

    });
}
/*提示窗口---非空验证提示**/
function RidfBookAlertMsgForNull(title) {
    layer.alert(title, {
        title: [q_title, q_color]
    })

}
/*提示窗口---在页面打开新窗口操作后，关闭**/
function RidfBookAlertMsgClose(title) {
    layer.alert(title, { title: [q_title, q_color] }, function () {
        parent.layer.closeAll();

    });
}

/*提示窗口，在本页面点击删除调到本页面**/
function RidfBookAlertMsgCurrentPage(title, url) {
    layer.alert(title, { title: [q_title, q_color] }, function () {

        
        window.location.href = url;
         layer.closeAll();
    });
}
/*页面跳转*/
function RidfBookGo(url,id) {

        window.location.href = url+"?id="+id;

  }
function RidfBookGo(url, id,t) {
        window.location.href = url + "?id=" + id+"&t="+t;

}
/*删除确认提示*/
function RidfBookDelAlertMsg(tip) {

    if ($("#txtRidfBookids").val() == "") {
        layer.alert('请至少选择一条数据', { title: [q_title, q_color] });
         return false;

     }
     else {
         layer.confirm('确认要'+tip+'吗？',
     {
         btn: ['是', '否'], //按钮
         title: [q_title, q_color]
     },
     function () {

         $("#btnRidfBookDel").click();
        


     });
     }
 return false;
}


/*删除一条确认提示*/
function RidfBookDelAlertMsgOne(id, tip) {

    layer.confirm('确认要' + tip + '吗？',
     {
         btn: ['是', '否'], //按钮
         title: [q_title, q_color]
     },
     function () {

         $("#txtRidfBookids").val(id);
         $("#btnRidfBookDel").click();

     });

    return false;

}

 
/*退出系统提示*/
function RidfBookOutAlertMsg() {

    parent.layer.confirm('确认要系统吗？',
     {
         btn: ['是', '否'], //按钮
         title: [q_title, q_color]
     },
     function () {
         parent.window.location.href = 'loginout';

     });


}
/*打开新窗口*/
function RidfBookOpen(myurl, mytitle, width, height, flag) {

    var url = myurl + "rnd=" + Math.random();
    layer.open({
        type: 2,
        title: [mytitle, q_color],
        maxmin: false,
        area: [width, height],
        content: url,
        end: function () {
            if (flag == true) {
                $("#btnRidfBookFind").click();

            }
        }
    });

    return false;
}
$(document).click(function (e) {

    //取得页面点击元素
    var o = null;
    if (window.event != null) {
        o = window.event.srcElement;
    }
    //提交按钮
    if (o != null && $(o).attr("type") == "submit") {
        // ajax提交按钮
        if ($(o).hasClass("ajax")) {  //页面无刷新
            $("form").eq(0).attr("target", "tosave");
        } else {
            $("form").eq(0).attr("target", "");
        }
    }
});

$(function () {

    //页面初始化加入iframe
    var usefullHtml = '<iframe name="tosave" id="tosave" style="display: none; clear: both"></iframe>';

    if ($("#tosave").length == 0) {

        $(document.body).append(usefullHtml);
    }


    /*分页多选*/
    //循环确认是否已经选择了值
    $(".RidfBookDuo").each(function () {
        var RidfBookids_arr = document.getElementById("txtRidfBookids").value;
        var selid = "|" + $(this).val() + ",";
        if (RidfBookids_arr.indexOf(selid) >= 0) {
            $(this).prop("checked", "true");
        }

    });

    //复选框单击事件
    $(".RidfBookDuo").click(function () {
        var RidfBookids_arr = $("#txtRidfBookids").val();
        if ($(this).prop("checked")) {
            if (RidfBookids_arr.indexOf("|" + $(this).val() + ",") >= 0) {
            } else {

                RidfBookids_arr += "|" + $(this).val() + ",";
            }
        }
        else {
            RidfBookids_arr = RidfBookids_arr.replace("|" + $(this).val() + ",", "");
        }
        $("#txtRidfBookids").val(RidfBookids_arr);
    });


});


jQuery.fn.rowspan = function (colIdx) { //封装的一个JQuery小插件 合并相同行
    return this.each(function () {
        var that;
        $('tr', this).each(function (row) {
            $('td:eq(' + colIdx + ')', this).filter(':visible').each(function (col) {
                if (that != null && $(this).html() == $(that).html()) {
                    rowspan = $(that).attr("rowSpan");
                    if (rowspan == undefined) {
                        $(that).attr("rowSpan", 1);
                        rowspan = $(that).attr("rowSpan");
                    }
                    rowspan = Number(rowspan) + 1;
                    $(that).attr("rowSpan", rowspan);
                    $(this).hide();
                } else {
                    that = this;
                }
            });
        });
    });
}
 