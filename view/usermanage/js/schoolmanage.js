/**
 * Created by ZDD on 2017/6/19.
 */
/**
 * Created by ZDD on 2017/6/16.
 * 实为student页面所需js
 */
$(function(){
    var $search = $('.btnSearch');
    var $reset = $('.btnReset');
    var $select = $('#headerLeftSEL');//搜索方式下拉菜单
    var $input = $('.headerinput input');
    var $newBtn = $('.newButton');
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
    /*检测是否登录*/
    if(!window.sessionStorage.getItem("access_token")){
        top.location.href="./../../login/login.html";
    }
    //输入框失去焦点获取则搜索方式
    $select.change(function(){
        searchType = this.value;
        $input.val('');
        clearInput();
    });
    function clearInput(){
        delete params.mobile;
        delete params.fullName;
        delete params.id;
    }
    //获取输入方式
    $input.focus(function(){
        clearInput();
        delete params.schoolId;
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
        }
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
        pageNum = 1;
        params.pageNum = pageNum;
        layer.open({type: 2, shadeClose: false});
        getData();
    });

    $search.click();//初始化页面

    //重置按钮
    $reset.on('click',function(){
        layer.open({type: 2, shadeClose: false});
        //初始化搜索条件
        delete params.mobile;
        delete params.schoolId;
        delete params.id;
        delete params.fullName;
        $input.val('');
        searchType = 1;
        $('option[value=1]').prop("selected","selected")
        var params1 = {//重新获取省
            areaId : 0
        };


        $('#selProvice').children('option:not(:first)').remove();
        $('#selCity').children('option:not(:first)').remove();
        $('#selCounty').children('option:not(:first)').remove();
        $('#selSchool').children('option:not(:first)').remove();
        /*$('#contenttable table').children('tr:not(:first)').remove();*/
        $('.managerDetilTable tr:not(:first)').remove();
        /*$('.contenttable').hide();*/
        $search.click();
        /*清理session*/
        window.sessionStorage.removeItem("schoolId");

        $.ajax({
            url:basepath + '/boss/common/get_area',
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify(params1)},
            success:function(data){
                layer.closeAll();
                $.each(data.result,function(index,item){
                    var options = '<option value="' + item.areaId + '">' + item.areaName + '</option>;';
                    $('#selProvice').append(options);
                })
            }
        });
    });
    /*查询获取数据*/
    function getData(){
        $.ajax({
            url:basepath + '/boss/schoolManager/list',
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
                    var status = '';
                    var stateText = '';
                    if(data.result.list==''){
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
                        trs += '<tr provinceName = "'+ item.provinceName +'" cityName = "'+ item.cityName +'" provinceId = "'+ item.provinceId +'" status = "'+ item.status +'" mobile = "' + item.mobile + '" password = "'+ item.password + '" id = "'+ item.id + '" fullName = "'+ item.fullName + '" schoolId = "'+ item.schoolId + '" schoolCode = "'+ item.schoolCode + '" schoolName = "'+ item.schoolName + '" areaName = "'+ item.areaName + '" schoolId = "'+ item.schoolId + '" areaId = "'+ item.areaId + '"> <td>'+ (index+1) + '</td> <td>' + item.id + '</td> <td>' + item.fullName+ '</td> <td>'+ item.mobile + '</td> <td>'+ item.schoolName +'</td> <td>'+ item.schoolCode +'</td> <td>'+ status +'</td> <td><a href="javascript:;" class="check">查看</a> | <a   href="javascript:;" class="modify">编辑</a> | <a href="javascript:;"  status = "'+ status +'" class="delete">'+ stateText +'</a></td> </tr>'
                    });
                    $('.contenttable table').append(trs);
                }else if(data.httpCode == '500'){
                    httpcodeServer(data.httpCode)
                }
            },
            error:function(error){
                layer.closeAll();
                errorCode(error);
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
                getData();
                $('.contenttable tr:not(:first)').remove();
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
