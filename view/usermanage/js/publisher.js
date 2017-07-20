/**
 * Created by ZDD on 2017/6/20.
 */
$(function(){
    var $search = $('.btnSearch');
    var $reset = $('.btnReset');
    var $hnewbtn = $('.newButton')
    var $select = $('#headerLeftSEL');//搜索方式下拉菜单
    var $input = $('.headerinput input');
    var searchType = 1;
    var pageSize = 12;
    var pageNum = 1;
    var  totalPage = "";
    var  totalRecords = "";
    var areaId = '';
    var $prvince  = $('#selProvice');
    var $city = $('#selCity');
    var $selcounty = $('#selCounty');
    var $popben = $('.popBtn');
    var $newAdd = $('.newAddPub');//出版社新增
    var $conTable = $('.contenttable table');
    var $pop = $('.pop');
    var istrue = false;
    var params = {//查询 获取出版社
        "access_token": "",
        "pageNum" :pageNum,
        "pageSize" :pageSize
    };
    var paramsBook = {//获取出版社参数
        "access_token": "",
        "publisher": ""
    };
    var paramsD = {//获取删除出版社参数
        "access_token": "",
        "id": "",
        'status':''
    };
    var paramsRank = {//获取出版社下级代理
        "access_token": "",
        "agencyCode": "",//出版社或代理商Code
        "pageSize": 10,
        "pageNum": 1,
        "agencyRank": '1'
    };

    var paramsModify = {//获取修改出版社参数
       /* "access_token": "",
        "id": "1",
        "password": "",	//可选（md5加密）
        "publisherName": "",		//可选
        "contactsName": "",		//可选
        "mobile":  "",			//可选
        "areaId": " [\"110000:110101\",\"120000:120104\"]", //可选，省编号:区县编号
        "level": 2,				//可选
        "divisionProportion": 30,		//可选
        "scanOrderQuantity": 1		//可选*/

    };
    var contactsName ={} //代理商信息暂存

    ;

    if(!window.sessionStorage.getItem("access_token")){
        top.location.href="./../../login/login.html";
    }

    params.access_token = window.sessionStorage.getItem("access_token");
    paramsBook.access_token = window.sessionStorage.getItem("access_token");
    paramsD.access_token = window.sessionStorage.getItem("access_token");
    paramsRank.access_token = window.sessionStorage.getItem("access_token");

    //获取学校id
    $prvince.change(function(){
        areaId = this.value;
    });
    /*$city.change(function(){
        areaId += ':' + this.value;
        params.areaId = areaId;
    });*/
    $selcounty.change(function(){
       /* console.log(areaId.split(':')[0]);*/
        areaId = areaId.split(':')[0];
        areaId += ':' + this.value;
        params.areaId = areaId;
        console.log(areaId);
    });
    //输入框失去焦点获取则搜索方式
    $select.change(function(){
        $input.val('');
        searchType = this.value;
        clearInput();
    });
    function clearInput(){
        delete params.mobile;
        /*delete params.schoolId;*/
        delete params.publisherName;
        delete params.id;
        delete params.contactsName;
    }

    //获取搜索类型
    $input.focus(function(){
        delete params.mobile;
        delete params.schoolId;
        delete params.publisherName;
        delete params.userId;
        delete params.areaId;
        delete params.id;
        delete params.contactsName;
    });
    $input.blur(function(){
        if($input.val().trim() != 0){
            if(searchType == 1){
                var  re = /^1\d{10}$/;
                if(!re.test($input.val().trim())){
                    tip('手机号码格式错误,请重新输入');
                    $input.val('');
                    return
                }
                params.mobile = $input.val().trim();
            }else if(searchType == 2){
                params.publisherName = $input.val().trim();
            }else if(searchType == 3){
                params.id = $input.val().trim();
            }else if(searchType == 4){
                params.contactsName  = $input.val().trim();
            }
        }
    });
    //查询
    $search.on('click',function(){
        $('.content').show();
        $('.contenttable tr:not(:first)').remove();
        $('.contenttable').show();
        window.sessionStorage.removeItem("areaId")
        window.sessionStorage.removeItem("userid")
        /*$('.pop').show();*/
       /* console.log(params);*/
        pageNum = 1;
        params.pageNum = pageNum;
        getDate();
    });

    $search.click();//初始化页面

    //重置
    $reset.on('click',function(){
        //初始化搜索条件
        delete params.mobile;
        delete params.schoolId;
        delete params.id;
        delete params.areaId;
        delete params.publisherName;
        delete params.contactsName;
        searchType = 1;
        window.sessionStorage.removeItem("schoolId");
        window.sessionStorage.removeItem("areaId")
        window.sessionStorage.removeItem("userid")
        $input.val('');
        $('option[value=1]').prop("selected","selected")
        var params1 = {//重新获取省
            areaId : 0
        };
        $('#selProvice').children('option:not(:first)').remove();
        $('#selCity').children('option:not(:first)').remove();
        $('#selCounty').children('option:not(:first)').remove();
        $('.pop').hide();
        /*$('.contenttable').hide();*/
        $search.click();
        $.ajax({
            url:basepath + '/boss/common/get_area',
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify(params1)},
            success:function(data){
                $.each(data.result,function(index,item){
                    var options = '<option value="' + item.areaId + '">' + item.areaName + '</option>;';
                    $('#selProvice').append(options);
                })
            }
        });
    });
    //
    $hnewbtn.on('click',function(){
        $(".header").hide();
        $('.content').hide();
        $('.newAddPub').show();
    });
    $popben.on('click',function(){
        $('.pop').hide();
    });
    /*出版社下级返回按钮*/
    $('#agentBackBtn').on('click',function(){
        $('.header').show();
        $('.content').show();
        $('.agentCheck').hide();
        $(".agentCheck tr:not(:first)").remove();
        $('.agentRank').text('二');
        paramsRank.agencyRank = 1.
    });
    //获取出版社书籍列表
      function getBooks(params){
          $('.popul li').remove();
          $.ajax({
              url:basepath + '/boss/publisher/bookList',
              type : 'POST',
              dataType:"json",
              data :{params :JSON.stringify(params)},
              success:function(data){
                  if(data.httpCode == '200'){
                      $.each(data.result,function(index,item){
                            var list = '';
                            list += '<li>' + item.bookName + '</li>';

                          $('.popul').append(list);
                      })
                  }
              }
          });
      }
    //删除出版社信息
    function publiserDelete(params){
        $.ajax({
            url:basepath + '/boss/publisher/delete',
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify(params)},
            success:function(data){
                if(data.httpCode == '200'){
                    paramsD.id = '';
                    if(paramsD.status == 1){
                        tip('恢复成功');
                    }else {
                        tip('删除成功');
                    }
                    paramsD.status = '';
                    $('.btnSearch').click();
                }
            }
        });
    }
    //获取代理商详细信息
    /*function getAgent(a,b){
        var obj = b[a];
        var trs = "<tr> <td>" + 1 + "</td> <td>" + a + "</td> <td>" + obj.publisherName + "</td> <td>" + obj.contactsName +"</td> <td>" + obj.mobile +"</td> <td>" + obj.mobile.areaId +"</td> <td>" + obj.bookNum +"</td><td><button>查看</button> </tr>"
        console.log(obj);
        $('.agentCheck table').append(trs)
    }*/
    /*查询信息*/
    function getDate(){
        $.ajax({
            url:basepath + '/boss/publisher/list',
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify(params)},
            success:function(data){
                if(data.httpCode == '200'){
                    $('.contenttable tr:not(:first)').remove();
                    totalRecords = data.result.total;
                    totalPage = Math.ceil(totalRecords/pageSize);
                    getPage();
                    if(data.result.list==''){
                        tip("暂无数据");
                        return
                    }
                    $.each(data.result.list,function(index,item){
                        var trs = '';
                        var id = item.id; //代理商信息
                        var str = '可用';
                        var stateStr = '删除';
                        var areaFull = '';
                        $.each(item.area,function(index,item){
                            areaFull += item.provinceName + '-' + item.cityName + '-' + item.areaName + " "
                        });

                        if(item.status == 0){
                            str = '不可用';
                            stateStr = '恢复';
                        }
                        index = 12 * (pageNum - 1) + index;
                        trs +='<tr areaId = "'+ item.areaId +'" mobile ="'+ item.mobile +'" contactsName = "'+ item.contactsName  +'" publisherName = "'+ item.publisherName +'" userid ="'+item.id+'" password ="'+item.passward+'" level ="'+item.level+'" divisionProportion ="'+item.divisionProportion+'" scanOrderQuantity ="'+item.scanOrderQuantity+'"> <td>'+ (index + 1) + '</td> <td>'+ item.id + '</td> <td >' + item.publisherName + '</td> <td>' + item.contactsName  + '</td> <td>' + item.mobile + '</td> <td >' + areaFull + '</td><td><button publisherName = "' + item.publisherName + '" class="booketype">' + item.bookNum + '</button></td> <td>' + item.level + '</td> <td><button agencyCode="' + item.agencyCode+ '" class="check">查看</button></td><td>'+ str + '</td> <td><button id ="'+item.id+'" class = "modify" qrCode="' + item.qrCode + '" areaId = "'+ item.areaId +'"   >编辑</button> | <button class = "delete" id ="'+item.id+'"  status = "'+ item.status +'">' + stateStr + '</button></td> </tr>'
                        $('.contenttable table').append(trs);
                        $(".modify").last().data("area",item.area);
                    });

                    $('.check').on('click',function(){

                        var id = $(this).prop('id');
                        istrue = true;
                        $('.header').hide();
                        $('.content').hide();
                        $('.agentCheck').show();
                        paramsRank.agencyCode = $(this).attr('agencyCode');
                        console.log( paramsRank.agencyRank);
                        getAgent(paramsRank);
                    });
                    $('.booketype').on('click',function(){
                        paramsBook.publisher = $(this).attr('publishername');
                        $('.pop').show();
                       /* $('.publisherAmend').hide();*/
                        getBooks(paramsBook);
                    });
                    $('.delete').on('click',function(){
                        paramsD.id = $(this).attr('id');
                        var delorrenew = '';
                        if ($(this).attr('status') == 0){
                            paramsD.status = 1;
                            delorrenew = "恢复";
                        }else {
                            paramsD.status = 0;
                            delorrenew = "删除";
                        }
                        layer.open({
                            content: '您确定要'+ delorrenew +'吗？'
                            ,btn: ['确定', '取消']
                            , style: 'width:200px;height:90px'
                            ,yes: function(){
                                publiserDelete(paramsD)
                            }
                        });

                    });
                }else if(data.httpCode == '500'){
                    httpcodeServer(data.httpCode)
                }
            },
            error:function(error){
              console.log(error);
            }
        });
    }
    /*分页展示*/
    function getPage(){
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
                $('.contenttable tr:not(:first)').remove();
                getDate();
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
    /*获取代理商下级信息*/
    function getAgent(paramsRank){
        $('.agentCheck tr:not(:first)').remove();
        layer.open({type: 2, shadeClose: false});
        $.ajax({
            url:basepath + '/boss/publisher/getNextAgent',
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify(paramsRank)},
            success:function(data){
                if(data.httpCode == 200){
                   layer.closeAll();
                    if(istrue){
                        paramsRank.agencyRank++;
                        console.log( paramsRank.agencyRank);
                        istrue = false;
                    }

                    switch(paramsRank.agencyRank)
                    {
                        case 3:
                            $('.agentRank').text('三');
                            break;
                        case 4:
                            $('.agentRank').text('四');
                            break;
                        case 5:
                            $('.agentRank').text('五');
                            break;
                        default:
                            $('.agentRank').text('二');
                    }
                    $.each(data.result,function(index,item){
                        var trs = '';
                            trs +=  '<tr> <td>' + (index + 1)+ '</td> <td>' + item.agencyCode + '</td> <td>'+ item.agencyName+'</td> <td>' + item.linkmanName+ '</td> <td>' + item.linkmanPhone+ '</td> <td>' + item.agencyAreaNameList + item.schoolNameList +'</td> <td>' + item.bookNum + '</td> <td><button class="checkNext" agencyCode = "'+ item.agencyCode +'" hasNextAgent = "'+ item.hasNextAgent +'">查看</button></td> </tr>'
                        $('.agentCheck table').append(trs);
                        if( $('.agentRank').text() == '四'){
                            $('.checkNext').text('已无下级').css('color','red').attr('disabled','true');
                        }
                    })
                }else if(data.httpCode == "40003"){
                        layer.closeAll();
                        tip('暂无下级代理');
                    paramsRank.agencyRank = 1;
                    $('#agentBackBtn').click();
                        return
                }else if(data.httpCode == '500'){
                    httpcodeServer(data.httpCode)
                }
                $('.checkNext').on('click',function(){
                    console.log( paramsRank.agencyRank);
                    paramsRank.agencyCode = $(this).attr('agencyCode');
                    if($(this).attr('hasNextAgent') == 1){
                        paramsRank.agencyRank++
                    }else if($(this).attr('hasNextAgent') == 0){
                        /*console.log($('this').children('button'));*/
                        console.log($(this).context);
                       /* $(this).css('color','red').text('已无下级').attr('disabled','true');*/
                        $(this).text('已无下级').css('color','red').attr('disabled','true');
                        return
                    }
                    getAgent(paramsRank);
                })

                
            }
        });
    }


});