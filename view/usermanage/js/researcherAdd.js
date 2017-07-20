/**
 * Created by ZDD on 2017/6/20.
 */
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
        "access_token": ""
    };
    $(".formtable div").removeAttr('formstyle');
    var paramSchoolid= {
        areaId :areaid
    };
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

    //获取区域id
    getarea(paramSchoolid,$provice,url);
    $provice.change(function(){
        $city.children('option:not(:first)').remove();
        $county.children('option:not(:first)').remove();
        if(this.value == "省/市"){
            return
        }
        paramSchoolid.areaId = this.value;
        getarea(paramSchoolid,$city,url);
    });
    $city.change(function(){
        $county.children('option:not(:first)').remove();
        if(this.value == "市"){
            return
        }
        paramSchoolid.areaId = this.value;
        getarea(paramSchoolid,$county,url)
    });
    $county.change(function(){
        if(this.value == "区/县"){
            return
        }
        params.areaId = this.value;
    });
    //获取学科信息
    $('#addsubjectCode').change(function(){
        params.subjectCode = this.value;
    });
    //获取学段信息
    $('#addstageCode').change(function(){
        if(this.value == '全部'){
            return
        }
        params.stageCode = this.value;
        $('#addsubjectCode').children('option:not(:first)').remove();
        var stageN = this.value;
        var params1 = {
            "stage": stageN
        };
        $.post({
            url : basepath  +'/boss/common/getSubjectByStage',
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify(params1)},
            success:function(data){
                $.each(data.result,function(index,item){
                    var options = '<option value="' + item.subjectCode + '">' + item.subjectName + '</option>';
                    $('#addsubjectCode').append(options);
                })
            }
        });


    });
    //头部新增按钮
    $newbtn.on('click',function(){
        $('.header').hide();
        $('.content').hide();
        $('.newAdd').show();
    });
    //取消按钮
    $('.cancelBtn').on('click',function(){
        $('.header').show();
        $('.content').show();
        $('.newAdd').hide();
        console.log('取消');
        clearMsg();
    });
    //提交
    $('.addBtn').on('click',function(event){
        //layer.open({type: 2, shadeClose: false});
        event.preventDefault();
        $.ajax({
            url:basepath + '/boss/reseacher/add',
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify(params)},
            success:function(data){
                if(data.httpCode == '200'){
                    //layer.closeAll();
                    $('.header').show();
                    $('.content').show();
                    $('.newAdd').hide();
                   tip('新增成功');
                    $('.btnSearch').click();
                    clearMsg()
                }else if(data.httpCode == '40002'){
                    //layer.closeAll();
                    tip('参数不完整，请继续选择');
                }else if(data.httpCode == '40003'){
                    layer.closeAll();
                    tip('该手机号码已存在，请重新输入。。。');
                    $('#phone').val('');
                }
            }
        });
    });
    function clearMsg(){
        $('#username').val('');
        $('#phone').val('');
        $('#selProvice1').children('option:first').attr("selected",true);
        $('#selCity1').children('option:not(:first)').remove();
        $('#selCounty1').children('option:not(:first)').remove();
        $("#addstageCode option:first").prop("selected","selected");
        $("#addsubjectCode option:first").prop("selected","selected");
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
//

});