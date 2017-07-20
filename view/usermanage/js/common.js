/**
 * Created by ZDD on 2017/6/17.
 */
/**
 * Created by ZDD on 2017/6/16.
 * 省市县学校四级联动所需js
 */
$(function(){
    /*省市县三级联动*/
    var areaId = 0;
    var $province = $("#selProvice");
    var $city = $('#selCity');
    var $country = $('#selCounty');
    var $school = $('#selSchool');
    var schoolId = '';
    var params = {
        areaId : areaId
    };
    /*初始化三级联动 省*/
    function getProvice(){
        $.ajax({
            url:basepath + '/boss/common/get_area',
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify(params)},
            success:function(data){
                $.each(data.result,function(index,item){
                    var options = '<option value="' + item.areaId + '">' + item.areaName + '</option>;';
                    $('#selProvice').append(options);
                });
                clearProvince();//不要港澳台
            }
        });
    }
    getProvice()
    //监听省变化获取市
    $province.change(function(){
        if(this.value == "省/市"){
            return
        }
        window.sessionStorage.removeItem("specialId");
        window.sessionStorage.removeItem("schoolId");
        params.areaId = this.value;
        $city.children('option:not(:first)').remove();
        $country.children('option:not(:first)').remove();
        $.post({
            url : basepath  +'/boss/common/get_area',
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify(params)},
            success:function(data){
                $.each(data.result,function(index,item){
                        var options = '<option value="' + item.areaId + '">' + item.areaName + '</option>;';
                    $('#selCity').append(options);
                })
            }
        });
    });
    //监听市变化获取县
    $city.change(function(){
        if(this.value == "市"){
            return
        }
        params.areaId = this.value;
      /*  console.log(this.value);*/
        $country.children('option:not(:first)').remove();
        $.post({
            url : basepath + '/boss/common/get_area',
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify(params)},
            success:function(data){
                console.log(data.result);
                $.each(data.result,function(index,item){
                    console.log(item.areaName);
                        var options = '<option value="' + item.areaId + '">' + item.areaName + '</option>;';
                    $('#selCounty').append(options);
                })
            }
        });
    });
    //监听县变化获取学校
    $country.change(function(){
        if(this.value == "区/县"){
            return
        }
        params.areaId = this.value;
        window.sessionStorage.setItem("specialId",this.value);//用于教研员和局长端搜索id
        $school.children('option:not(:first)').remove();
        $.post({
            url : basepath + '/boss/common/get_school',
            /*url : 'textbooktest.e-edusky.com/boss/common/get_school',*/
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify(params)},
            success:function(data){
                $school.children('option:not(:first)').remove();
                $.each(data.result,function(index,item){
                        var options = '<option value="' + item.schoolId + '">' + item.schoolName + '</option>;';
                    $('#selSchool').append(options);
                })
            }
        });
    });
    /*选取学校*/
    $school.change(function(){
        if(this.value == "选择学校"){
            return
        }
        schoolId = this.value;
        window.sessionStorage.setItem("schoolId",schoolId);

    });
});
