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
    var params = {
        "access_token": "",
        "pageNum" :pageNum,
        "pageSize" :pageSize

    };
    params.access_token = window.sessionStorage.getItem("access_token");
    window.sessionStorage.removeItem("schoolId");//进来先清理schoolid防止别的端选择对此产生影响
    if(!window.sessionStorage.getItem("access_token")){
        top.location.href="./../../login/login.html";
    }
    //输入框失去焦点获取则搜索方式
    $select.change(function(){
        searchType = this.value;
        $input.val('');
    });
    $input.focus(function(){
        delete params.mobile;
        delete params.schoolId;
        delete params.realName;
        delete params.userId;
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
                params.realName = $input.val().trim();
            }else if(searchType == 3){
                params.userId = $input.val().trim();
            }
        }
       /* console.log(params);*/
    });
    //查询
    $search.on('click',function(){
        $('.contenttable tr:not(:first)').remove();
        $('.contenttable').show();
        //搜索下拉菜单 类型 1 手机号码 2 姓名 3 用户id
        $select.change(function(){
            searchType = this.value;
        });
        if(window.sessionStorage.getItem("schoolId")&&window.sessionStorage.getItem("schoolId") !=''){
            var school = window.sessionStorage.getItem("schoolId");
            params.schoolId = school;
        }
        /*console.log(params);*/
        layer.open({type: 2, shadeClose: false});
        pageNum = 1;
        params.pageNum = pageNum;
        getDate();
    });

    //重置按钮
    $reset.on('click',function(){
        //初始化搜索条件
        delete params.mobile;
        delete params.schoolId;
        delete params.userId;
        delete params.realName;
        $input.val('');
        searchType = 1;
        $('option[value=1]').prop("selected","selected")
        var params1 = {//重新获取省
            areaId : 0
        };
        /*$select.children('option').attr("selected","selected");*/
        /*$('#selProvice').children('option:first').prop("selected","selected");*/
        $('#selProvice').children('option:not(:first)').remove();
        $('#selCity').children('option:not(:first)').remove();
        $('#selCounty').children('option:not(:first)').remove();
        $('#selSchool').children('option:not(:first)').remove();
        $('.contenttable tr:not(:first)').remove();
        /*$('tr:not(:first)').remove();*/
       /* $('.contenttable').hide();*/
        $search.click();
        /*清理session*/
        window.sessionStorage.removeItem("schoolId");
            /*layer.open({type: 2, shadeClose: false});*/
        $.ajax({
            url:basepath + '/boss/common/get_area',
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify(params1)},
            success:function(data){
                layer.closeAll();
                console.log('重置成功');
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

    $search.click();//初始化
    /*获取查询数据*/
    function getDate(){
        console.log(pageNum);
        $.ajax({
            url:basepath + '/boss/student/list',
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify(params)},
            success:function(data){
                if(data.httpCode == '200'){
                    $('.contenttable tr:not(:first)').remove();
                    layer.closeAll();
                    totalRecords = data.result.total;
                    totalPage = Math.ceil(totalRecords/pageSize);
                    getPage();
                    var trs = '';
                    if(data.result.list==''){
                        tip("暂无数据");
                        return
                    }
                    $.each(data.result.list,function(index,item){
                        var isPaid = '';
                        if(item.isPaid == 1 ){
                            isPaid = '是';
                        }else{
                            isPaid = '否';
                        }
                        index = 12 * (pageNum - 1) + index;
                        trs +='<tr userid ="'+item.userId+'"> <td>'+ (index + 1) + '</td> <td>'+ item.userId + '</td> <td>' + item.realName + '</td> <td>' + item.mobile + '</td> <td>' + item.parentMobile + '</td> <td>' + item.schoolName + '</td>  <td> ' + item.bookNum + '</td> <td> ' + isPaid + '</td> <td><a href="javascript:;">查看详情</a></tr>'
                    });
                    $('.contenttable table').append(trs);
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
