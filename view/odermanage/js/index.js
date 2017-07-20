/**
 * Created by Administrator on 2017/6/16.
 */
$(function(){
    var province =$(".province");
    var city =$(".city");
    var county =$(".county");
    var shoole =$(".shoole");
    var pay = $(".pay");
    var type ="";
    var text = "";
    var orderNum ="";
    var mobile ="";
    var bookName="";
//    var realName ="";
    var publisher ="";
    var ctbname ="";
    var status = "";
    var schoolId = "";
    var startTime = "";
    var endTime = "";
    var  pageNum = 1;
    var  pageSize = 12;
    var  totalPage = ""
    var  totalRecords = "";
    var access_token = window.sessionStorage.getItem("access_token");
    if(access_token == 'null'|| access_token == null){
        top.location.href = "./../../login/login.html";
    }
    var params= {
        "access_token": access_token,
        "pageNum":pageNum,
        "pageSize":pageSize
    }
//三级联动效果展示
    //获取省 .................
       getDatas(0,province);
    //获取市..............
       $(".province").change(function(){
           var areaId = $(".province option:selected").attr("areaId");
          city.children("option:first").attr("selected","selected")
          city.children('option:not(:first)').remove();
           getDatas(areaId,city);
       })
    //获取县..........
    $(".city").change(function(){
        var areaId = $(".city option:selected").attr("areaId");
        county.children("option:first").attr("selected","selected")
        county.children('option:not(:first)').remove();
        getDatas(areaId,county);

    })
    //获取学校........
    $(".county").change(function(){
        var areaId = $(".county option:selected").attr("areaId");
        shoole.children("option:first").attr("selected","selected")
        shoole.children('option:not(:first)').remove();
        var params = {
            areaId:areaId   //查询省份，areaId=0，查询市，areaId是所选省份的id
        }
        $.ajax({
                url:basepath+"boss/common/get_school",
                type:"POST",
                dataType:"json",
                data:{params:JSON.stringify(params)},
                success:function(data){
                    if(data.httpCode==200){
                        var data = data.result;
                        $.each(data,function(i,item){
                            var html = '<option schoolId="'+item.schoolId+'">'+item.schoolName+'</option>'
                            shoole.append(html);
                        })

                    };
                },
                error:function(err){
                    tip(err.message)
                }
            }
        )

    })
    function getDatas(areaId,subject){
        var params = {
            areaId:areaId   //查询省份，areaId=0，查询市，areaId是所选省份的id
        }
        $.ajax({
                url:basepath+"boss/common/get_area",
                type:"POST",
                dataType:"json",
                data:{params:JSON.stringify(params)},
                success:function(data){
                    if(data.httpCode==200){
                        var data = data.result;
                        $.each(data,function(i,item){
                            var html = '<option areaId="'+item.areaId+'">'+item.areaName+'</option>'
                            subject.append(html);
                        })

                    };
                },
                error:function(err){
                    tip(err.message);
                }
            }
        )
    }


//重置效果
    $(".btns .btn:last").on("click",function(){
        province.children('option:first').prop("selected","selected");
        city.children('option:first').prop("selected","selected");
        county.children('option:first').prop("selected","selected");
        shoole.children('option:first').prop("selected","selected");
        $(".search").children('option:first').prop("selected","selected");
        pay.children('option:first').prop("selected","selected");
        province.children('option:not(:first)').remove();
        city.children('option:not(:first)').remove();
        county.children('option:not(:first)').remove();
        shoole.children('option:not(:first)').remove();
        $(".headerinput input").val("");
        $(".tab tr:first").siblings().remove();
        $(".startTime").val("");
        $(".endTime").val("");
        getDatas(0,province);
            orderNum: "";
//            realName: "";
            mobile: "";
            publisher: "";
            bookName: "";
            ctbname: "";
            status: "";
            schoolId: "";
            startTime: "";
            endTime: "";
         pageNum = 1;
         params= {
            "access_token":access_token,
            "pageNum":pageNum,
            "pageSize":pageSize
        }
        getData();

    });

//获取支付状态
    $(".pay").change(function(){
        status = $(".pay option:selected").attr("value");
        if(status && status!= ""){
            params.status = status;
        }else{
            delete params.status;
        }
    })
//获取搜索类型
    $(".headerinput input").change(function(){
        type = $(".search option:selected").prop("value");
        text = $.trim($(this).val());
        switch (type){
            case "orderNum":orderNum = text; break;
            case "mobile":mobile = text; break;
//            case "realName":realName = text; break;
            case "publisher":publisher = text; break;
            case "bookName":bookName = text; break;
            case "ctbName":ctbname = text; break;
        };
        if(orderNum && orderNum!= ""){
            params.orderNum = orderNum;
        };
//        if(realName && realName!= ""){
//            params.realName = realName;
//        };
        if(mobile && mobile!= ""){
            params.mobile = mobile;
        };
        if(publisher && publisher!= ""){
            params.publisher = publisher;
        };
        if(bookName && bookName!= ""){
            params.bookName = bookName;
        };
        if(ctbname && ctbname!= ""){
            params.ctbName = ctbname;
        };
    })
    $(".search").change(function(){
        $(".headerinput input").val("");
        delete params.orderNum;
//        delete params.realName;
        delete params.mobile;
        delete params.publisher;
        delete params.bookName;
        delete params.ctbName;
        orderNum = "";
//        realName = "";
        mobile = "";
        publisher = "";
        bookName = "";
        ctbname = "";
    })

//获取时间范围
    $(".startTime").blur(function(){
        startTime = $(".startTime").val();
        if(startTime && startTime != ''){
            params.startTime = startTime;
        }else{
            delete  params.startTime;
        }
    })
    $(".endTime").blur(function(){
        endTime = ($(".endTime").val());
        if(endTime && endTime != ''){
            params.endTime = endTime;
        }else{
            delete params.endTime;
        }
    })
//获取shooleID
    $(".shoole").change(function(){
        schoolId = $(".shoole option:selected").attr("schoolId");
        if(schoolId && schoolId != ''){
            params.schoolId = schoolId;
        }else{
            delete  params.schoolId;
        }
    })

//    初始化获取返回列表数据
       getData();

       function getData(){
           $.ajax({
               url:basepath+"boss/order/list",
               type:"post",
               "dataType":"json",
               data:{params:JSON.stringify(params)},
               beforeSend: function () {
//                   layer.open({type: 2, shadeClose: false});
               },
               success:function(data){
                console.log(data);
                   if(data.httpCode==200){
                       totalRecords = data.result.total;
                       totalPage = Math.ceil(totalRecords/pageSize);
                       if(totalRecords>0){
                           page();
                           var html = "";
                           var data = data.result.list;
                           $.each(data,function(i,item){
                               i = 12 * (pageNum - 1) + i;
                               html='<tr><td>'+(i+1)+'</td><td title="'+item.orderNum+'">'+item.orderNum+'</td><td title="'+item.orderBody+'">'+item.orderBody+'</td><td>'+item.totalMoney+'</td><td>'+item.mobile+'</td><td>'+item.payWays+'</td><td>'+judgeNull(datechange(item.endTime,2))+'</td><td>'+transzf(item.status)+'</td><td class="reacher text-info btn-link">查看</td></tr>';
                               $(".tab").append(html);
                               $(".reacher:last").data("data",item);
                           });
                           $(".reacher").on("click",function(){
                               var data =$(this).data("data");
                               $(".content1").css("display","none");
                               $(".content2").css("display","block");
                               var detailTpl = doT.template($("#tpl").html());
                               $("#interpolationtmpl").html(detailTpl(data));
                           })
                       }else{
                        tip("没有列表数据");
                       }
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
//                   layer.closeAll();
               }
           })

       }
   $(".btn:first").on("click",function(){
       var $this = $(this)
       $this.prop("disabled",true);
       setTimeout(function(){
           $this.prop("disabled",false);
       },100);
       $(".tab tr:first").siblings().remove();
       pageNum = 1;
       params.pageNum = pageNum;
       getData();
   })
//  点击查看

    //关闭
    $(".closed .btn").on("click",function(){
        $(".content1").css("display","block");
        $(".content2").css("display","none");

    })


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
                $(".tab tr:first").siblings().remove();
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
    }
})