/**
 * Created by Administrator on 2017/6/18.
 */
$(function(){

    var access_token = window.sessionStorage.getItem("access_token");
    if(access_token == 'null'|| access_token == null){
        top.location.href = "./../../login/login.html";
    }
    var  userType = "";
    var  status = "";
    var  startTime = "";
    var  endTime = "";
    var  pageNum = 1;
    var  pageSize = 12;
    var  totalPage = ""
    var  totalRecords = "";
    var params= {
        "access_token": access_token,
        "pageNum":pageNum,
        "pageSize":pageSize
    }

//获取时间范围
    $(".startTime").blur(function(){
        startTime = $(".startTime").val();
        if(startTime && startTime != ''){
            params.startTime = startTime;
        }else{
            delete params.startTime;
        };
    })
    $(".endTime").blur(function(){
//        var  startTimes = Date.parse(new Date($(".startTime").val()));
//        var  endTimes = Date.parse(new Date($(".endTime").val()));
        endTime = $(".endTime").val();
        if(endTime && endTime != ''){
            params.endTime = endTime;
        }else{
            delete params.endTime;
        };
    })
// 反馈类型
    $(".status").change(function(){
       status = $(".status option:selected").attr("value");
        if(status && status != ""){
            params.status = status;
        }else{
            delete params.status;
        }

    })
//用户类型
    $(".userType").change(function(){
        userType = $(".userType option:selected").attr("value");
        if(userType && userType != ''){
            params.userType = userType;
        }else{
            delete params.userType;
        }
    })


//    初始化 获取反馈列表
    getData();
//    点击查询
    $(".btn:first").on("click",function(){
        var $this = $(this)
        $this.prop("disabled",true);
        setTimeout(function(){
            $this.prop("disabled",false);
        },100);
        pageNum = 1;
        params.pageNum = pageNum;
        getData();
    })
//   重置效果
    $(".btns .btn:last").on("click",function(){
        $(".userType").children('option:first').prop("selected","selected");
        $(".status").children('option:first').prop("selected","selected");
        $(".startTime").val("");
        $(".endTime").val("");
        userType = "";
        status = "";
        startTime = "";
        endTime = "";
        pageNum = 1;
        params= {
            "access_token": access_token,
            "pageNum":pageNum,
            "pageSize":pageSize
        }
        getData();
    });

    function getData(){
        console.log(params);
        $(".tab tr:first").siblings().remove();
        $.ajax({
            url:basepath+"boss/feedback/list",
            type:"post",
            "dataType":"json",
            data:{params:JSON.stringify(params)},
            beforeSend: function () {
//                layer.open({type: 2, shadeClose: false});
            },
            success:function(data){
                if(data.httpCode ==200){
                    totalRecords = data.result.total;
                    totalPage = Math.ceil(totalRecords/pageSize);
                    if(totalRecords>0){
                        page();
                        var html = "";
                        var data = data.result.list;
                        $.each(data,function(i,item){
                            i = 12 * (pageNum - 1) + i;
                            html='<tr><td>'+(i+1)+'</td><td title="'+item.userId+'">'+item.userId+'</td><td>'+item.realName+'</td><td>'+item.mobile+'</td><td class="con" title="'+item.content+'">'+judgeNull(item.content)+'</td><td>'+datechange(item.createTime,2)+'</td><td>'+translx(item.userType)+'</td><td>'+transck(item.status)+'</td><td class="reacher text-info btn-link" data="'+item.id+'">查看</td></tr>';
                            $(".tab").append(html)
                            $(".reacher:last").data("data",item);

                        })
                        //点击查看
                        $(".reacher").on("click",function(){
                            var data =$(this).data("data");
                            $(".content1").css("display","none");
                            $(".content2").css("display","block");
                            $(".keyvalue").eq(0).html(data.realName);
                            $(".keyvalue").eq(1).html(translx(data.userType));
                            $(".keyvalue").eq(2).html(data.mobile);
                            $(".keyvalue").eq(3).html(datechange(data.createTime,2));
                            $(".text").html(judgeNull(data.content));
                            $(".shooleName").html(data.schoolName);
                            $(".greads").html(transxd(data.schoolLevel));
                            var Id = $(this).attr("data");
                            var params1= {
                                "access_token": access_token,
                                "id": Id
                            }
                            $.ajax({
                                url:basepath+"boss/feedback/scan",
                                type:"post",
                                "dataType":"json",
                                data:{params:JSON.stringify(params1)},
                                success:function(data){
                                    console.log(data);
                                    getData();

                                }
                            });
                        })
                    }else{
                        tip("没有列表数据");
                    };
                }else if(data.httpCode ==500){
                    tip("服务器异常，请稍后再试");
                };
            },
            error:function(err){
                if(err.status ==709){
                    window.sessionStorage.clear();
                    top.location.href = "./../../login/login.html";
                };
            },
            complete: function () {
//                    layer.closeAll();
              //    关闭
                $(".closed .btn").on("click",function(){
                    $(".content1").css("display","block");
                    $(".content2").css("display","none");
                })
            }
        })
    }


  //分页查询 初始化
 function page(){
     kkpager.total = totalPage;
     kkpager.totalRecords = totalRecords;
     kkpager.generPageHtml({
         pno : pageNum,
         //总页码
         total : totalPage,
         //总数据条数
         totalRecords : totalRecords,
         mode : 'click',//默认值是link，可选link或者click
         click : function(n){
             // do something
             //手动选中按钮
             this.selectPage(n);
             pageNum = n;
             params.pageNum = pageNum;
             getData();
             return false;
         }
         ,lang               : {
             firstPageText           : '首页',
             firstPageTipText        : '首页',
             lastPageText            : '尾页',
             lastPageTipText         : '尾页',
             prePageText             : '上一页',
             prePageTipText          : '上一页',
             nextPageText            : '下一页',
             nextPageTipText         : '下一页',
             totalPageBeforeText     : '共',
             totalPageAfterText      : '页',
             currPageBeforeText      : '当前第',
             currPageAfterText       : '页',
             totalInfoSplitStr       : '/',
             totalRecordsBeforeText  : '共',
             totalRecordsAfterText   : '条数据',
             gopageBeforeText        : ' 转到',
             gopageButtonOkText      : '确定',
             gopageAfterText         : '页',
             buttonTipBeforeText     : '第',
             buttonTipAfterText      : '页'
         }
     },true);
 };
    //转变教师 学生
    function translx(obj){
        if(obj == 1){
            return "学生";
        }else if(obj == 2){
            return "教师";
        }
    };
    //转变是否查看
    function transck(obj){
        if(obj == 0){
            return "未查看";
        }else if(obj == 1){
            return "已查看";
        }
    };
    //转变学校名称
    function transxd(arr){
        var htm = "";
        for(i in arr){
            if(arr[i] ==1){
                htm +="小学,"
            }else if(arr[i] ==2){
                htm += "初中,"
            }else if(arr[i] ==3){
                htm += "高中,"
            };
        };
        var reg = /,$/gi;
        htm = htm.replace(reg,"");
        return htm;
    };
})