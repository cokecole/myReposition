/**
 * Created by ZDD on 2017/6/16.
 * 实为student页面所需js
 */
$(function(){
    var $search = $('.btnSearch');
    var $reset = $('.btnReset');
    var $select = $('#headerLeftSEL');//搜索方式下拉菜单
    var $input = $('.headerinput input');
    var searchType = 1;
    var pageSize = 12;
    var pageNum = 1;
    var  totalPage = "";
    var  totalRecords = "";
    var $stageSel = $('#stageSel');//学段
    var $subjectSel = $('#subjectSel');//学科
    var params = {//教研员列表参数
        "access_token": "",
        "pageNum" :pageNum,
        "pageSize" :pageSize
    };
    var paramDetil = {//教研员详情参数
        "access_token": "",
        "password": ""
    };
    window.sessionStorage.removeItem("specialId");
    params.access_token = window.sessionStorage.getItem("access_token");
    paramDetil.access_token = window.sessionStorage.getItem("access_token");

    if(!window.sessionStorage.getItem("access_token")){
        top.location.href="./../../login/login.html";
    }
    //输入框失去焦点获取则搜索方式
    $select.change(function(){
        searchType = this.value;
        $input.val('');
        delete params.mobile;
        delete params.id;
        delete params.fullName;
        /*delete params.areaId;*/
    });
    //获取搜索方式
    $input.focus(function(){
        delete params.mobile;
        /*delete params.areaId;*/
        delete params.fullName;
        delete params.id;
    });
    $input.blur(function(){
        if($input.val().trim() != ''){
            if(searchType == 1){
                var  re = /^1\d{10}$/;
                if(!re.test($input.val().trim())){
                    tip('手机号码格式错误,请重新输入');
                    $input.val('');
                    return
                }
                params.mobile = $input.val().trim();
            }else if(searchType == 2){
                params.fullName = $input.val().trim();
            }else if(searchType == 3){
                params.id = $input.val().trim();
            }
        }else {
            return
        }
    });
    //获取学科学段信息
    $stageSel.change(function(){
        $subjectSel.children('option:not(:first)').remove();
        delete params.stageCode ;
        delete params.subjectCode ;
        if(this.value == '全部'){
            return
        }
        var stageN = this.value;
        params.stageCode = this.value;
        var params1 = {
            "stage": stageN
        };
        console.log(params);
        $.post({
            url : basepath  +'/boss/common/getSubjectByStage',
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify(params1)},
            success:function(data){
                console.log(params);
                $.each(data.result,function(index,item){
                    var options = '<option value="' + item.subjectCode + '">' + item.subjectName + '</option>';
                    $subjectSel.append(options);
                })
            }
        });
    });

    //获取学科信息
    $subjectSel.change(function(){
        delete params.subjectCode ;
        if(this.value == '全部'){
            return
        }
        params.subjectCode = this.value;
    });
    
    
    
    //查询
    $search.on('click',function(){
        layer.open({type: 2, shadeClose: false});
        $('.contenttable tr:not(:first)').remove();
        $('.contenttable').show();
        if(window.sessionStorage.getItem("specialId")&&window.sessionStorage.getItem("specialId") !=''){
            var id = window.sessionStorage.getItem("specialId");
            params.areaId = id;
        }
        pageNum = 1;
        params.pageNum = pageNum;
        getDate();


    });

    $search.click();//初始化页面

    //选择学科
    /*$subject.change(function(){
        if(this.value){
            params.subjectCode  = this.value;
        }
    });*/

    //重置按钮
    $reset.on('click',function(){
        //初始化搜索条件
        delete params.mobile;
        delete params.schoolId;
        delete params.subjectCode ;
        delete params.stageCode ;
        delete params.fullName;
        delete params.id;
        delete params.areaId;
        searchType = 1;
        $input.val('');
        $('#subjectSel option:not(:first)').remove();
        $("#stageSel option:first").prop("selected","selected");
        $('#headerLeftSEL option[value=1]').prop("selected","selected")
       /* $("#stageSel option[value=" + "全部"+"]").attr("selected","selected");*/
       /* $('option[value=1]').prop("selected","selected")*/
        var params1 = {//重新获取省
            areaId : 0
        };


        $('#selProvice').children('option:not(:first)').remove();
        $('#selCity').children('option:not(:first)').remove();
        $('#selCounty').children('option:not(:first)').remove();
        $('#selSchool').children('option:not(:first)').remove();
        /*$('#contenttable table').children('tr:not(:first)').remove();*/
        $('.researcherDetilTable tr:not(:first)').remove();
        /*$('.contenttable').hide();*/
        $search.click();
        /*清理session*/
        window.sessionStorage.removeItem("specialId");
        layer.open({type: 2, shadeClose: false});
        $.ajax({
            url:basepath + '/boss/common/get_area',
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify(params1)},
            success:function(data){
                layer.closeAll()
                $.each(data.result,function(index,item){
                    var options = '<option value="' + item.areaId + '">' + item.areaName + '</option>;';
                    $('#selProvice').append(options);
                })
            },
            error:function(error){
                console.log(error);
            }
        });
    });
    //获取教研员详情
    /*$('.table').delegate('a','click',function(){
        paramDetil.password = $(this).attr('password');
        paramDetil.mobile = $(this).attr('mobile');
        $.ajax({
            url:basepath + '/boss /reseacher/detail',
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify(params)},
            success:function(data){
                console.log(data);
            }
        });
    })*/
    /*获取查询信息*/
    function getDate(){
        /*console.log(params);*/
        $.ajax({
            url:basepath + '/boss/reseacher/list',
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify(params)},
            success:function(data){
                if(data.httpCode == '200'){
                    layer.closeAll();
                    totalRecords = data.result.total;
                    totalPage = Math.ceil(totalRecords/pageSize);
                    getPage();
                    var trs = '';
                    var fullname = '';
                    var status = '';
                    var stateText = '';
                    if(data.result.list == ''){
                        tip("暂无数据");
                        return
                    }
                    $.each(data.result.list,function(index,item){
                        if(item.status == 0){
                            status = '不可用';
                            stateText = '恢复';
                        }else {
                            status = '可用';
                            stateText = '删除';
                        }
                        index = 12 * (pageNum - 1) + index;
                        fullname += item.provinceName + "-" + item.cityName + '-' +item.areaName;
                        trs +='<tr stageCode  ="'+item.stageCode +'" subjectCode  ="'+item.subjectCode +'" areaId ="'+item.areaId+'" fullName ="'+item.fullName+'" status ="'+item.status+'" id ="'+item.id+'"  mobile ="'+item.mobile+'"  password ="'+item.password+'"> <td>'+ (index + 1 )+ '</td> <td>'+ item.id + '</td> <td>' + item.fullName + '</td> <td>' + item.mobile + '</td>  <td>' + item.stageName  + '</td> <td>' + item.subjectName  + '</td><td>' + fullname + '</td> <td>' + status + '</td> <td> <a href="javascript:;" class="check">查看</a> | <a href="javascript:;" class="modify" provinceName = "'+ item.provinceName +'" cityName = "'+ item.cityName +'" areaName = "'+ item.areaName +'">编辑</a> | <a href="javascript:;" class="delete">'+ stateText +'</a> </td></tr>'
                        fullname = ''
                    });
                    $('.contenttable table').append(trs);
                }else if(data.httpCode == '500'){
                    httpcodeServer(data.httpCode)
                }
            },
            error:function(error){
                errorCode(error);
            }
        });
    }

    //分页展示
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
    }



});
