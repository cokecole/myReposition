/**
 * Created by ZDD on 2017/6/19.
 */
$(function(){
    var $newbtn = $('.newButton');
    var $username = $('#username');
    var $phone = $('#phone');
    var $schoolecode = $('#schoolNumber');
    var areaid = 0;
    var $provice = $('#selProvice1');
    var $city = $('#selCity1');
    var $county = $('#selCounty1');
    var $school = $('#selSchool1');
    var url = '/boss/common/get_area';
    var params= {
        "access_token": "",
        /*"areaId" : ""*/
    };
    $(".formtable div").removeAttr('formstyle');
    var paramSchoolid= {
        areaId :areaid
    };
    /*检测是否登录*/
    if(!window.sessionStorage.getItem("access_token")){
        top.location.href="./../../login/login.html";
    }
    if(window.sessionStorage.getItem("access_token")&&window.sessionStorage.getItem("access_token") !=''){
        var access_token = window.sessionStorage.getItem("access_token");
        params.access_token = access_token;
    }
    //获取姓名
        $username.blur(function(){
            params.fullName = this.value;
        });
    //获取手机号
        $phone.focus(function(){
            delete params.mobile;
        });
        $phone.blur(function(){
            if(this.value.trim()){
                var  re = /^1\d{10}$/;
                if(!re.test(this.value.trim())){
                    tip('手机号码格式错误,请重新输入');
                    $(this).val('');
                    return
                }
                params.mobile = this.value;
            }

        });

    //获取学校id
        getarea(paramSchoolid,$provice,url);
        $provice.change(function(){
            $city.children('option:not(:first)').remove();
            $county.children('option:not(:first)').remove();
            $school.children('option:not(:first)').remove();
            if(this.value == "省/市"){
                return
            }
            paramSchoolid.areaId = this.value;
            getarea(paramSchoolid,$city,url);
        });
         $city.change(function(){
            $county.children('option:not(:first)').remove();
            $school.children('option:not(:first)').remove();
             if(this.value == "市"){
                 return
             }
            paramSchoolid.areaId = this.value;
            getarea(paramSchoolid,$county,url)
        });
         $county.change(function(){
             $school.children('option:not(:first)').remove();
             console.log(this.value);
             if(this.value == "区/县"){
                 return
             }
             params.areaId = this.value;
             paramSchoolid.areaId = this.value;
             var url2 = '/boss/common/get_school';
            getarea(paramSchoolid,$school,url2);
        });
        $school.change(function(){
            params.schoolId = this.value;
        });
    //获取学校编码
    $schoolecode.blur(function(){
        params.schoolCode = this.value;
    });
    //头部新增按钮
    $newbtn.on('click',function(){
        $('.header').hide();
        $('.content').hide();
        $('.addManager').show();
    });
    //取消按钮
    $('.cancelBtn').on('click',function(){
        $('.header').show();
        $('.content').show();
        $('.addManager').hide();
        clearMsg();
    });
    //提交
    $('.addBtn').on('click',function(event){
        console.log(params);
        event.preventDefault();
        $.ajax({
            url:basepath + '/boss/schoolManager/add',
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify(params)},
            success:function(data){
                if(data.httpCode == '200'){
                    $('.header').show();
                    $('.content').show();
                    $('.addManager').hide();
                    $('.btnSearch').click();
                  clearMsg(); //清空页面数据
                }else if(data.httpCode == '40002'){
                    layer.closeAll();
                    tip('参数不全，请选择完全参数');
                }else if(data.httpCode == '40003'){
                    layer.closeAll();
                    tip('该手机号码已存在，请重新输入。。。');
                    $('#phone').val('');
                }
            },
            error : function(error){
                errorCode(error);
            }
        });
    });
    //清理数据
    function clearMsg(){
        $username.val('');
        $phone.val('');
        $schoolecode.val('');
        $provice.children('option:first').attr("selected",true);
        $city.children('option:not(:first)').remove();
        $county.children('option:not(:first)').remove();
        $school.children('option:not(:first)').remove();
        $('#selProvice1 option:first').prop("selected","selected");
    }

   //三级联动ajax
    function getarea(a,b,url){
        $.ajax({
            url:basepath + url,
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify(a)},
            success:function(data){
                $.each(data.result,function(index,item){
                    if(item.schoolName){
                        var options = '<option value="' + item.schoolId + '">' + item.schoolName + '</option>;';
                        b.append(options);
                        return
                    }
                    var options = '<option value="' + item.areaId + '">' + item.areaName + '</option>;';
                    b.append(options);
                })
            }
        });
    };


});