/**
 * Created by ZDD on 2017/6/20.
 */
$(function(){
    var $publisherName = $('#publishermesname');
    var $contactsName  = $('#publishermesperson');
    var $addphone = $('#publishermesphone');
    var $divisionProportion = $('#divisionProportion');
    var $provice = $('#selProvice1');
    var $city = $('#selCity1');
    var $county = $('#selCounty1');
    var areaurl = '/boss/common/get_area';
    var threeareaid = 0;
    var $cancel =$('.newAddre_cancel');
    var tally = true;
    var istrue = true;
    var $addparams = {
        "access_token": "",
        "publisherName": "", //出版社名称
        "contactsName": "", //联系人名称
        "mobile": "",
        "areaId": "", //省编号:区县编号
        "level": 2,  //代理层级
        "divisionProportion": 30, //分成比例
        "scanOrderQuantity": 1,  ////订单数量统计是否可查：1：是；2：否
        "qrCode": ""
    };
    /*检测是否登录*/
    if(!window.sessionStorage.getItem("access_token")){
        top.location.href="./../../login/login.html";
    }
    var paramSchoolid= {
        areaId :threeareaid
    };
    var index = 1;
    var parammoreId = {//添加多地区信息
    };
    if(window.sessionStorage.getItem("access_token")&&window.sessionStorage.getItem("access_token") !=''){
        var access_token = window.sessionStorage.getItem("access_token");
        $addparams.access_token = access_token;
    }
    //获取出版社
    $publisherName.blur(function(){
        $addparams.publisherName = this.value;
    });
    //获取联系人
    $contactsName.blur(function(){
        $addparams.contactsName = this.value;
    });
    //获取联系方式
    $addphone.blur(function(){
        if(this.value.trim()){
            var  re = /^1\d{10}$/;
            if(!re.test(this.value.trim())){
                tip('手机号码格式错误,请重新输入');
                $addphone.val('');
                return
            }
            $addparams.mobile = this.value.trim();
        }
    });
    $addphone.focus(function(){
        $addparams.mobile ='';
    });
    //获取分成比例
    $divisionProportion.blur(function(){
        var reg = /^(?:0|[1-9][0-9]?|100)$/;
        if(reg.test(this.value)){
            $addparams.divisionProportion = this.value;
        }else {
            tip('请输入0-100整数');
            $divisionProportion.val('');
        }

        /*console.log($addparams);*/
    });

    /*添加多地区*/
    $('.addtyle').on('click',function(){
        istrue = false;
        $('.deleteyle').show();
        index++
        parammoreId[index] = {areaId :threeareaid};
        /*console.log(parammoreId[index]);*/
        var selProvice = 'selProvice' + index;
        var selCity = 'selCity' + index;
        var selCounty = 'selCounty' + index;
        var sels = ' <div index="'+ index +'" class="agencymeSpan pull-left"><span >代理地区'+ index+'：</span></div><select index="'+ index +'" class="form-control pull-left selProvice" id="'+ selProvice +'"> <option value="">省/市</option> </select> <select index="'+ index +'" class="form-control pull-left selCity" id="'+ selCity +'"> <option value="">市</option> </select> <select index="'+ index +'" class="form-control pull-left selCounty" id="'+ selCounty +'"> <option value="">区/县</option> </select>'
        $('.agencymeBox').append(sels);
        getarea(parammoreId[index],$('#selProvice' + index),areaurl);
        /*getMoreadd();*/
    });
    /*获取新增多地区id信息*/
    //动态获取市
    $('.agencymeBox ').delegate('.selProvice','change',function(){
        if(this.value == ""){
            return
        }
        var num = $(this).attr('index');
        parammoreId[num].areaId = this.value;
       /* $addparams.areaId += "," + "'" + this.value;*/
        $('#selCity' + num).children('option:not(:first)').remove();
        $('#selCounty' + num).children('option:not(:first)').remove();
        getarea(parammoreId[num],$('#selCity'+num),areaurl);
    });
    //动态获取区
    $('.agencymeBox ').delegate('.selCity','change',function(){
        if(this.value == ""){
            return
        }
        var num = $(this).attr('index');
        parammoreId[num].areaId = this.value;
        $('#selCounty' + num).children('option:not(:first)').remove();
        getarea(parammoreId[num],$('#selCounty'+num),areaurl);
    });
    $('.agencymeBox ').delegate('.selCounty','change',function(){
        istrue = true;
        if(this.value == "区/县"){
            return
        }
        /*$addparams.areaId += ":" + this.value + "'";*/
    });
    /*删除多余省市区列表*/
    $('.deleteyle').on('click',function(){
        istrue = true;
        delete parammoreId[index];
       /* console.log($addparams.areaId);*/
        $addparams.areaId = $addparams.areaId.split(',');
        $addparams.areaId.splice(index-1,1);
       /* console.log($addparams.areaId);*/
        $addparams.areaId = $addparams.areaId.join(',');
        /*console.log($addparams.areaId);*/
        if(index==2){
            $('.deleteyle').hide();
        }
        $(".newAddPub  select[index = "+index+"]").remove();
        $(".newAddPub  .agencymeSpan[index = "+ index +"]").remove();
        index--
    });

    //获取代理省市id信息
    //"[\"110000:110101\",\"120000:120104\"]",
    //省市县三级联动
    getarea(paramSchoolid,$provice,areaurl);
        $provice.change(function(){
            /*console.log(this.value);*/
            $city.children('option:not(:first)').remove();
            $county.children('option:not(:first)').remove();
            if(this.value == ""){
                return
            }
            paramSchoolid.areaId = this.value;
            //添加地区id
           /* $addparams.areaId = "[\"110000:110101\",\"120000:120104\"]",*/
           /* $addparams.areaId = "['"+ this.value;*/
            getarea(paramSchoolid,$city,areaurl);
        });
        $city.change(function(){
            console.log(this.value);
            /*$addparams.areaId += ":"+ this.value +"']";*/
            $county.children('option:not(:first)').remove();
            if(this.value == ""){
                return
            }
            paramSchoolid.areaId = this.value;
            getarea(paramSchoolid,$county,areaurl)
        });
        $county.change(function(){
            /*$addparams.areaId += ":"+ this.value +"']";*/
            /*$addparams.areaId += ":" + this.value +"'";*/
            if(this.value == ""){
                return
            }
            paramSchoolid.areaId = 0;
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
                })
            }
        });
    };
    /*图片上传*/
    $('#uploadingBtn').on("click", function () {
        if(tally){
            $("#uploadingCon").click();
            tally = false;
        }
    });
    $("#uploadingCon").change(function(){
        var url = basepath + '/boss/common/fileUpload';
        $("#headerForm").ajaxSubmit({
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
                    $('#headerimg').attr("src", oData.result.path);
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
    

    //订单数量统计是否可查

    var value =$('input[name="items"]:checked').val();
    //添加 //"[\"110000:110101\",\"120000:120104\"]",
    $('.newAddbtn').on('click',function(){
        $addparams.areaId = '';
        console.log(index);
        $addparams.areaId += '[';
        for(var i = 1;i<=index;i++){
            if (i > 1) {
                $addparams.areaId += ",";
            }
            var selP = $('#selProvice'+ i).val();
            if (selP == "") {
                /*console.log("省没选");*/
                tip("请选择省份");
                return
            }
            var selC = $('#selCounty' + i).val();
            if (selC == "") {
                tip("请选择区域");
                return
            }
            $addparams.areaId += "'" + selP + ':'+ selC+ "'";
        }
        $addparams.areaId += ']';
        var value1 =$('input[name="items"]:checked').val();
        var value2 =$('input[name="hierarchy"]:checked').val();
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
        //发送创建请求
        console.log(index);
        if($publisherName.val() == '' || $contactsName.val() == ''||$addphone.val() == ''|| $divisionProportion.val()==''|| !value1 || !value2){
            tip("信息不完整，请补全");
            return;
        }
        if(!$addparams.qrCode){
            tip("选择需要上传的二维码");
            return;
        }
        layer.open({type: 2, shadeClose: false});
        $.ajax({
            url:basepath + '/boss/publisher/add',
            type : 'POST',
            dataType:"json",
            data :{params :JSON.stringify($addparams)},
            success:function(data){
                if(data.httpCode == '200'){
                    layer.closeAll();
                    $('.content').show();
                    $('.header').show();
                    $('.newAddPub').hide();
                    $('.btnSearch').click();
                    tip('创建成功');
                    clearAdd();
                }else if(data.httpCode == '40002'){
                    layer.closeAll();
                    tip('参数不完整，请补全参数');
                    return
                    /*clearAdd();*/
                }else if(data.httpCode == '40003'){
                    layer.closeAll();
                    tip('该手机号码已存在，请重新输入。。。');
                    $('#phone').val('');
                    /*clearAdd();*/
                    return
                }else if(data.httpCode == '500'){
                    httpcodeServer(data.httpCode)
                    /*clearAdd();*/
                }
            },
            error : function(error){
                errorCode(error);
            }
        });
    });

    //取消按钮
    $('.newAddre_cancel').on('click',function(){
        $('.header').show();
        $('.content').show();
        $('.newAddPub').hide();
        clearAdd();
    });
    /*清除新增页面数据*/
        function clearAdd(){
            $publisherName.val('');
            $addphone.val('');
            $contactsName.val('');
            $divisionProportion.val('');
            $addparams.areaId = '';
            $('#selProvice1 option:first').prop("selected","selected");
            $('#selCity1').children('option:not(:first)').remove();
            $('#selCounty1').children('option:not(:first)').remove();
            $('.agencymeBox .agencymeSpan:not(:first)').remove();
            $(".selProvice").remove();
            $(".selCity").remove();
            $(".selCounty").remove();
            $('.deleteyle').hide();
            $('#headerimg').attr('src','../../images/file.png')
            $('#form1 input').attr('checked',false);

        }

 });