/**
 * Created by ZDD on 2017/6/20.
 */
$(function(){
    var $publisherName = $('#pubaddpubname');
    var $contactsName  = $('#pubAmendpubperson');
    var $addphone = $('#pubAmendpubphone');
    var $divisionProportion = $('#divAmendProportion');
    var $provice = $('#amendProvice1');
    var $city = $('#amendCity1');
    var $county = $('#amendCountry1');
    var areaurl = '/boss/common/get_area';
    var threeareaid = 0;
    var $cancel =$('.amendCancel');
    var renderid ='';//用于临时渲染修改页省市区id
    var tally = true;
    var $addparams = {
        "access_token": "",
        "id": "",
        "publisherName": "", //出版社名称
        "contactsName": "", //联系人名称
        "mobile": "",
        "areaId": "", //省编号:区县编号
        "level":'' ,  //代理层级
        "divisionProportion": '', //分成比例
        "scanOrderQuantity": 1,  ////订单数量统计是否可查：1：是；2：否
        "qrCode": ""
        /*"password": ""*/
    };
    var paramSchoolid= {
        areaId :threeareaid
    };
    var istrue = false;
    /*检测是否登录*/
    if(!window.sessionStorage.getItem("access_token")){
        top.location.href="./../../login/login.html";
    }
    if(window.sessionStorage.getItem("access_token")&&window.sessionStorage.getItem("access_token") !=''){
        var access_token = window.sessionStorage.getItem("access_token");
        $addparams.access_token = access_token;
    }

    $('.contenttable table').delegate('.modify','click',function(){

        $addparams.areaId = $(this).attr('areaid');
        renderid = $(this).attr('areaid');
        $addparams.id = $(this).attr('id');
        /*console.log($addparams);*/
        $('.publisherAmend').show();
        $('.header').hide();
        $('.content').hide();
        $('.agentCheck').hide();
        var trNode = $(this).parent().parent();
       /* var tdNode = $(this).parent().siblings();*/
        //渲染修改页信息
        var imgurl = $(this).attr('qrCode');//渲染页面图片
        $('#headerimgAmend').attr("src", imgurl);
        $('#pubaddpubname').val(trNode.attr('publisherName'));
        $('#pubAmendpubperson').val(trNode.attr('contactsName'));
        $('#pubAmendpubphone').val(trNode.attr('mobile'));
        $('#divAmendProportion').val(trNode.attr('divisionProportion'));
        var areaId = trNode.attr('areaId');
        var userid = trNode.attr('userid');
        window.sessionStorage.setItem("userid",userid);

        var level = trNode.attr('level');
        var scanOrderQuantity = trNode.attr('scanOrderQuantity');
        if(scanOrderQuantity == 1){
            $('.indent-1').prop('checked','checked');
        }else {
            $('.indent-2').prop('checked','checked');
        }
        if(level == 4){
            $('.hierarchy-4').prop('checked','checked');
        }else if(level == 3){
            $('.hierarchy-3').prop('checked','checked');
        }else if(level == 2){
            $('.hierarchy-2').prop('checked','checked');
        }
        //渲染省市县
        var area = $(this).data("area");
        console.log(area);
        $.each(area,function(index,item){
            if(index!=0){
                $('.addtyle2').click();
            }
            var proName = item.provinceName;
            var proVal = item.provinceId;
            var cityName = item.cityName;
            var cityVal = item.cityId;
            var areaName = item.areaName;
            var areaVal = item.areaId;
            $('#amendProvice'+(index+1) +' option:first').text(proName);
            $('#amendProvice'+(index+1) +' option:first').prop("value",proVal);
            $('#amendCity'+(index+1) +' option:first').text(cityName);
            $('#amendCity'+(index+1) +' option:first').prop("value",cityVal);
            $('#amendCity'+(index+1)).prop("disabled",true);
            $('#amendCountry'+(index+1) +' option:first').text(areaName);
            $('#amendCountry'+(index+1) +' option:first').prop("value",areaVal);
            $('#amendCountry'+(index+1)).prop("disabled",true);
        });
    });
    //省市县三级联动
    getarea(paramSchoolid,$provice,areaurl);
    $provice.on("click",function(){
        $('#amendProvice1 option:first').text('省/市');
        $('#amendProvice1 option:first').prop("value",'');
    });
    $provice.change(function(){
        istrue = true;
        $city.children('option:not(:first)').remove();
        $county.children('option:not(:first)').remove();
        $('#amendCity1 option:first').text('市');
        $('#amendCity1 option:first').prop('value','');
        $('#amendCity1').removeAttr("disabled");
        $('#amendCountry1 option:first').text("区/县");
        $('#amendCountry1 option:first').prop('value','');
        if(this.value == ''){
            return
        }
        paramSchoolid.areaId = this.value;
        getarea(paramSchoolid,$city,areaurl);
    });
    $city.change(function(){
        console.log(this.value);
        /*$addparams.areaId += ":"+ this.value +"']"*/
        $county.children('option:not(:first)').remove();
        $('#amendCountry1').removeAttr("disabled");
        if(this.value == ''){
            return
        }
        paramSchoolid.areaId = this.value;
        getarea(paramSchoolid,$county,areaurl)
    });
    $county.change(function(){
        /*$addparams.areaId += ":"+ this.value;*/
    });
    function getarea(a,b,url){
        $.ajax({
            url:basepath + url,
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify(a)},
            success:function(data){
                $.each(data.result,function(index,item){
                    var options = '<option value="' + item.areaId + '">' + item.areaName + '</option>;';
                    b.append(options);
                });
                clearProvince();//不要港澳台
            }
        });
    };
    /*多地区添加*/
    var parammoreId = {//添加多地区信息
    };
    var index = 1;
    $('.addtyle2').on('click',function(){
        $('.deleteStatus2').show();
        index++
        parammoreId[index] = {areaId :threeareaid};
        var amendProvice = 'amendProvice' + index;
        var amendCity = 'amendCity' + index;
        var amendCountry = 'amendCountry' + index;
        var sels = ' <div index="'+ index +'" class="agencymeSpan pull-left"><span >代理地区'+ index+'：</span></div><select index="'+ index +'" class="form-control pull-left amendProvice" id="'+ amendProvice +'"> <option value="">省/市</option> </select> <select index="'+ index +'" class="form-control pull-left amendCity" id="'+ amendCity +'"> <option value="">市</option> </select> <select index="'+ index +'" class="form-control pull-left amendCountry" id="'+ amendCountry +'"> <option value="">区/县</option> </select>'
        $('.agencymeBox1').append(sels);
        getarea(parammoreId[index],$('#amendProvice' + index),areaurl);
    });
    /*动态获取市*/
    $('.agencymeBox1 ').delegate('.amendProvice','change',function(){
        istrue = true;
        var num = $(this).attr('index');
        parammoreId[num].areaId = this.value;
       /* $addparams.areaId += "','" + this.value;*/
        $('#amendCity' + num).children('option:not(:first)').remove();
        $('#amendCountry' + num).children('option:not(:first)').remove();
        $('#amendCity'+num +' option:first').text('市');
        $('#amendCity'+num +' option:first').prop('value','');
        $('#amendCity'+num).removeAttr("disabled");
        $('#amendCountry'+num +' option:first').text("区/县");
        $('#amendCountry'+num +' option:first').prop('value','');
        if(this.value == ""){
            return
        }
        getarea(parammoreId[num],$('#amendCity'+num),areaurl);
    });
    //动态获取区
    $('.agencymeBox1 ').delegate('.amendCity','change',function(){
        var num = $(this).attr('index');
        $('#amendCountry' + num).children('option:not(:first)').remove();
        $('#amendCountry'+num).removeAttr("disabled");
        if(this.value == ""){
            return
        }
        parammoreId[num].areaId = this.value;
        getarea(parammoreId[num],$('#amendCountry'+num),areaurl);
    });
    //获取区id
    /*删除多余省市区列表*/
    $('.deleteyle2').on('click',function(){
        delete parammoreId[index];
        istrue = true;
        /*console.log(index);
        console.log( $addparams.areaId);
        console.log( parammoreId);*/
        $addparams.areaId = $addparams.areaId.split(',');
        $addparams.areaId.splice(index-1,1);
        $addparams.areaId = $addparams.areaId.join(',');
        if(index==2){
            $('.deleteyle2').hide();
        }
        $(".agencymeBox1  select[index = "+index+"]").remove();
        $(".agencymeBox1  .agencymeSpan[index = "+ index +"]").remove();
        index--
    });
    //订单数量统计是否可查
    /*图片上传*/
    $('#uploadingAmend').on("click", function () {
        if(tally){
            $("#uploadingConAmend").click();
            tally = false;
        }
    });
    $("#uploadingConAmend").change(function(){
        var url = basepath + '/boss/common/fileUpload';
        $("#headerFormAmend").ajaxSubmit({
            url: url,
            type: "POST",
            dataType: 'json',
            contentType: false,
            beforeSend: function () {
                layer.open({type: 2, shadeClose: false});
            },
            success: function (oData, statusText) {
                layer.closeAll();
                //提交成功后调用
                if (oData.httpCode == "200") {
                    $('#headerimgAmend').attr("src", oData.result.path);
                    $addparams.qrCode = oData.result.path;
                    console.log( $addparams);
                    tally = true;
                } else {
                    tip("上传失败！文件不合格");
                }
            }, error: function (err) {

            }, complete: function () {
                layer.closeAll();
            }
        })
    });
    /*修改发送请求*/
    $('.newAmendbtn').on('click',function(){
        var reg = /^(?:0|[1-9][0-9]?|100)$/;
        //获取区id
        if(istrue){
            $addparams.areaId = '';
            console.log(index);
            $addparams.areaId += '[';
            for(var i = 1;i<=index;i++){
                if (i > 1) {
                    $addparams.areaId += ",";
                }
                var selP = $('#amendProvice'+ i).val();
                if (selP == "") {
                    tip("请选择省份");
                    return
                }
                var selC = $('#amendCountry' + i).val();
                if (selC == "") {
                    tip("请选择区域");
                    return
                }
                $addparams.areaId += "'" + selP + ':'+ selC+ "'";
            }
            $addparams.areaId += ']';
        }
        console.log($addparams);
        var value1 =$('input[name="items1"]:checked').val();
        var value2 =$('input[name="hierarchy1"]:checked').val();
        /*$addparams.id = $(this).attr('id');*/
        /*console.log(value1);
        console.log(value2);*/
        if(value1=='可查'){
            $addparams.scanOrderQuantity = 1;
        }else if(value1=='不可查'){
            $addparams.scanOrderQuantity = 2;
        }
        if(value2 == '四级'){
            $addparams.level = 4;
        }else if(value2 == '三级'){
            $addparams.level = 3;
        }else if(value2 == '二级'){
            $addparams.level = 2;
        }
        //获取出版社信息 联系人
        $addparams.qrCode = $('#headerimgAmend').attr("src")
       /* console.log($('#headerimgAmend').attr("src"));*/
        if($('#pubaddpubname').val().trim()!== ''){
            $addparams.publisherName = $('#pubaddpubname').val().trim();
        }
        if($('#pubAmendpubperson').val().trim() !== ''){
            $addparams.contactsName = $('#pubAmendpubperson').val().trim();
        }
        if($('#pubAmendpubpassword').val().trim() !== ''){
            $addparams.password = hex_md5($('#pubAmendpubpassword').val().trim());
        }

        if($('#pubAmendpubphone').val().trim() !== ''){
            $addparams.mobile = $('#pubAmendpubphone').val().trim();
        }
        if($('#divAmendProportion').val().trim() !== ''){
            if(reg.test($('#divAmendProportion').val().trim())){
                $addparams.divisionProportion = $('#divAmendProportion').val().trim();
            }else {
                tip('分成比例：请输入0-100整数');
                $('#divAmendProportion').val('');
                return
            }

        }

        console.log($addparams);
        if(!$addparams.qrCode){
            tip("选择需要上传的二维码");
            return;
        }
        //发送创建请求
        layer.open({type: 2, shadeClose: false});
        $.ajax({
            url:basepath + '/boss/publisher/modify',
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify($addparams)},
            success:function(data){
                if(data.httpCode == '200'){
                    layer.closeAll();
                    istrue = false;
                    index = 1;
                    $('.header').show();
                    $('.content').show();
                    $('.publisherAmend').hide();
                    $('.btnSearch').click();
                    window.sessionStorage.removeItem("areaId")
                    window.sessionStorage.removeItem("userid")
                    console.log('修改成功');
                    clearAmend();
                }
                httpcodeServer(data.httpCode);
            },
            error : function(error){
                layer.closeAll();
                errorCode(error)
            }

        });
    });

    //取消按钮
    $cancel.on('click',function(){
        $('.header').show();
        $('.content').show();
        $('.publisherAmend').hide();
        window.sessionStorage.removeItem("areaId")
        window.sessionStorage.removeItem("userid")
        index = 1;
        clearAmend();
    });
    //清理数据
    function clearAmend(){
        $publisherName.val('');
        $addphone.val('');
        $contactsName.val('');
        $divisionProportion.val('');
        $addparams.areaId = '';
        $('#amendProvice1 option:first').prop("selected","selected");
        $('#amendCity1').children('option:not(:first)').remove();
        $('#amendCountry1').children('option:not(:first)').remove();
        $('.agencymeBox1 .agencymeSpan:not(:first)').remove();
        $(".amendProvice").remove();
        $(".amendCity").remove();
        $(".amendCountry").remove();
        $('.deleteyle2 ').hide();
        $('#headerimgAmend').attr('src','../../images/file.png')
        $('#form2 input').attr('checked',false);
    }
});