/**
 * Created by Administrator on 2017/6/27.
 */
/**
 * Created by Administrator on 2017/6/17.
 */
$(function(){
    var status = 0;
    var productType = "";
    var type ="";
    var text = "";
    var bookId ="";
    var bookName ="";
    var publisher ="";
    var gradeCode = "";
    var subjectCode = "";
    var isAll = 0;
    var  pageNum = 1;
    var  pageSize = 12;
    var  totalPage = ""
    var  totalRecords = "";
    var bookTypeName = $(".bookTypeName");
    var access_token = window.sessionStorage.getItem("access_token");
    if(access_token == 'null'|| access_token == null){
        top.location.href = "./../../login/login.html";
    }
    var params= {
        "access_token": access_token,
        "pageNum":pageNum,
        "pageSize":pageSize,
        "parentId": 0//可选 综合书书籍ID（查询综合书下的子书时传参）
    }

//        //获取学年、学科
    $(".greads").change(function(){
        $(".classes").children('option:first').siblings().remove();
        var isCode = $(".greads option:selected").attr("code");
        if(isCode != ""){
            $.ajax({
                url:basepath+"boss/common/get_grade_subject",
                type:"post",
                dataType:"json",
                success:function(data){
                    console.log(data)
                    var classes = $(".greads option:selected").attr("value");
                    var num = parseInt(classes);
                    var data = data.result;
                    var obj = [];
                    for(key in data){
                        obj.push(data[key])
                    };
                    var results= obj[num].subjectList;
                    var ob = [];
                    for(key in results){
                        ob.push(results[key])
                    };
                    $.each(ob,function(i,ite){
                        var html = '<option code="'+(i+1)+'">'+ite+'</option>';
                        $(".classes").append(html)
                    });
                }
            });
        }else{
            return;
        }
    });

    //编辑 新增里的学年学科.uncompre
    $(".uncompre .bjgreads").change(function(){
        $(".uncompre .bjclasses").children('option:first').siblings().remove();
        $(".uncompre .bookTypeName").children('option:first').siblings().remove();
        var isCode = $(".bjgreads option:selected").attr("code");
        if(isCode != ""){
            $.ajax({
                url:basepath+"boss/common/get_grade_subject",
                type:"post",
                dataType:"json",
                success:function(data){
                    console.log(data)
                    var classes = $(".uncompre .bjgreads option:selected").attr("value");
                    var num = parseInt(classes)
                    var data = data.result;
                    var obj = [];
                    for(key in data){
                        obj.push(data[key])
                    };
                    var results= obj[num].subjectList;
                    var ob = [];
                    for(key in results){
                        ob.push(results[key])
                    };
                    $.each(ob,function(i,ite){
                        var html = '<option code="'+(i+1)+'">'+ite+'</option>';
                        $(".uncompre .bjclasses").append(html)
                    });
                }
            });
        }else{
            return;
        }
    });
    //编辑 新增里的学年学科.compre
    $(".compre").delegate(".bjgreads1","change",function(){
        $(".compre .bjclasses1").each(function(i,ele){
            $(ele).children('option:first').siblings().remove();
        });
        $(".compre .bookTypeName1").each(function(i,ele){
            $(ele).children('option:first').siblings().remove();
        })

        var isCode = $(".bjgreads1 option:selected").attr("code");
        if(isCode != ""){
            $.ajax({
                url:basepath+"boss/common/get_grade_subject",
                type:"post",
                dataType:"json",
                success:function(data){
                    console.log(data)
                    var classes = $(".compre .bjgreads1 option:selected").attr("value");
                    var num = parseInt(classes)
                    var data = data.result;
                    var obj = [];
                    for(key in data){
                        obj.push(data[key])
                    };
                    var results= obj[num].subjectList;
                    var ob = [];
                    for(key in results){
                        ob.push(results[key])
                    };
                    $.each(ob,function(i,ite){
                        var html = '<option code="'+(i+1)+'">'+ite+'</option>';
                        $(".compre .bjclasses1").append(html);
                    })
                }
            })
        }else{
            return;
        };
    });

//获取搜索类型
    $(".search").change(function(){
        $(".headerinput input").val("");
        delete  params.bookId ;
        delete params.publisher ;
        delete params.bookName ;
        bookId = "";
        bookName = "";
        publisher = "";
    });
    $(".headerinput input").change(function(){
        type = $(".search option:selected").prop("value");
        text = $.trim($(this).val());
        switch (type){
            case "bookId":bookId = text; break;
            case "bookName":bookName = text; break;
            case "publisher":publisher = text; break;
        };

        if(bookId && bookId!= ""){
            params.bookId = bookId;
        };
        if(bookName && bookName!= ""){
            params.bookName = bookName;
        };
        if(publisher && publisher!= ""){
            params.publisher = publisher;
        };

    })
    //获取年级和学科Code
    $(".greads").change(function(){
        gradeCode = $(".greads option:selected").attr("code");
        if(gradeCode && gradeCode!= ""){
            params.grade = gradeCode;
        }else{
            delete params.grade;
            delete params.subject;
        }
    })

    $(".classes").change(function(){
        subjectCode = $(".classes option:selected").attr("code");
        if(subjectCode && subjectCode!= ""){
            params.subject = subjectCode;
        }else{
            delete params.subject;
        };
    });
//产品类型
    $(".counselling").change(function(){
        productType = $(".counselling option:selected").attr("id");
        if(productType && productType!=""){
            params.productType = productType;
        }else{
            delete params.productType;
        }

    })
//是否上架
    $(".status").change(function(){
        status = $(".status option:selected").attr("value");
        if(status && status!= ""){
            params.status = status;
        }else{
            delete params.status;
        };
    })
    //上传图片
    $('#headers').on("click", function () {
            $("#header").click();
    });
    $("#header").change(function () {
        var url = basepath + "boss/common/fileUpload";
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

                } else {
                    tip("上传失败！文件不合格");
                };
            }, error: function (err) {

            }, complete: function () {
                layer.closeAll();
            }
        });
        return false;
    });
//查询
    $(".btns .btn1").on("click",function(){
        params.parentId = 0;
        pageNum = 1;
        params.pageNum = pageNum;
        console.log(params);
        getData();
    });
//初始化
    getData();
    function getData(){
        $(".tab tr:first").siblings().remove();
        $.ajax({
            url:basepath+"boss/book/list",
            type:"post",
            dataType:"json",
            data:{params:JSON.stringify(params)},
            success:function(data) {
                console.log(data)
                if(data.httpCode==200){
                    totalRecords = data.result.total;
                    totalPage = Math.ceil(totalRecords/pageSize);
                    if(totalRecords>0){
                        page();
                        var data = data.result.list;
                        var html = "";
                        $.each(data,function(i,item){
                            i = 12 * (pageNum - 1) + i;
                            if(item.isAll == 1){
                                html='<tr><td>'+(i+1)+'</td><td title="'+item.bookName+'">'+item.bookName+'</td><td>'+item.bookId+'</td><td>'+greadeChange(item.grade)+'</td><td>'+subjectChange(item.subject)+'</td><td>'+judgeIs(item.isAll)+'</td><td>无</td><td>'+datechange(item.updateDate,2)+'</td><td>'+item.publisher+'</td><td>'+judge(item.status)+'</td><td><button class="control text-info btn-link">编辑</button>|<button class="view text-info btn-link">查看</button><td><button class="export text-info btn-link">二维码</button></td></tr>';
                            }else{
                                html='<tr><td>'+(i+1)+'</td><td title="'+item.bookName+'">'+item.bookName+'</td><td>'+item.bookId+'</td><td>'+greadeChange(item.grade)+'</td><td>'+subjectChange(item.subject)+'</td><td>'+judgeIs(item.isAll)+'</td><td>'+item.ctbName+'</td><td>'+datechange(item.updateDate,2)+'</td><td>'+item.publisher+'</td><td>'+judge(item.status)+'</td><td><button class="control text-info btn-link">编辑</button></td><td><button class="export text-info btn-link">二维码</button></td></tr>';
                            }
                            $(".tab").append(html);
                            $(".control:last").data("data",item);
                            $(".export:last").data("data",item);
                        });
                        //跳转到编辑页面
                        $(".control").on("click",function(){
                            $(".content2").show().siblings().hide();
                            relode();
                            $(".content2 .btns .btn4").text("保存");
                            $(".content2 .btns .btn4").addClass("edit")
                            var data =$(this).data("data");

                            var hxproductId = data.productId;
                            var bjbook = data.bookId;
                            var isall = data.isAll;
                            if(isall == 0){
                                $(".uncompre").show();
                                $(".compre").hide();
                            }else if(isall == 1){
                                $(".uncompre").hide();
                                $(".compre").show();
                                $(".compre .add").hide();
                                $(".compre .discipline").hide();
                            }
//                      回显数据
                            $(".content2 .bookname .book").val(data.bookName);
                            var hxstatus = data.status;
                            if(hxstatus ==0){
                                $(".judges input:first").prop("checked","checked");
                            }else{
                                $(".judges input:last").prop("checked","checked");
                            };

                            if(isall ==0){
                                $("#jiedian1").val(data.nodeId);
                                getBookTypes(data.grade,data.subject,bookTypeName,function(){
                                    $('.bookTypeName option[booktypecode='+data.ctbcode+']').prop("selected","selected");
                                });
                                $(".judge input:first").prop("checked","checked");
                                $('.bjgreads option[code='+data.grade+']').prop("selected","selected");
                                var date = data;
                                $.ajax({
                                    url:basepath+"boss/common/get_grade_subject",
                                    type:"post",
                                    dataType:"json",
                                    success:function(data){
                                        var num = parseInt( $(".bjgreads option:selected").attr("value"));
                                        var data = data.result;
                                        var obj = [];
                                        for(key in data){
                                            obj.push(data[key])
                                        };
                                        var results= obj[num].subjectList;
                                        var ob = [];
                                        for(key in results){
                                            ob.push(results[key])
                                        };
                                        $.each(ob,function(i,ite){
                                            var html = '<option code="'+(i+1)+'">'+ite+'</option>';
                                            $(".bjclasses").append(html)
                                        });
                                        $('.bjclasses option[code='+date.subject+']').prop("selected","selected");
                                    }
                                });
                                var  produceDID =  $(".produce_one option:first").data("data")
                                $.each(produceDID,function(i,item){
                                    if(item.productId ==hxproductId){
                                        $('.produce_one option[productId='+hxproductId+']').prop("selected","selected");
                                        $(".produce_two").hide();
                                    }else{
                                        $(".produce_two").show();
                                        $.each(item.children,function(x,option){
                                            if(option.productId ==hxproductId){
                                                $('.produce_one option').eq(i+1).prop("selected","selected");
                                                var html = '<option productId="'+option.productId+'" selected>'+option.productName+'</option>';
                                                $(".produce_two").append(html)
                                            }
                                        })
                                    }
                                });

                            }else{
                                $(".judge input:last").prop("checked","checked");
                                $('.bjgreads1 option[code='+data.grade+']').prop("selected","selected");
                            };
                            $(".judge input").prop("disabled",true);
                            var url = data.imgUrl;
                            $("#headerimg").attr("src",url);
                            $('.tongbufudao option[id='+data.productType+']').prop("selected","selected");
                            $('.publisherName option[id='+data.publisherId+']').prop("selected","selected");
                            //编辑
                            $(".content2 .btns .edit").unbind().on("click",function(){
                                if($(this).hasClass("edit")){
                                    var $this = $(this)
                                    $this.prop("disabled",true);
                                    setTimeout(function(){
                                        $this.prop("disabled",false);
                                    },1000);
                                    var  params1 = {};
//获取书名
                                    var bjbookName = $(".content2 .bookname .book").val();
                                        if(bjbookName.trim()==""){
                                            tip("书籍名称不能为空");
                                            return;
                                        };
//获取产品类型
                                    var userType = $(".produces option:selected").attr("id");
//获取图片路径
                                    var imgUrl = $(".file img").attr("src");
                                    if(imgUrl ==""||imgUrl == "../../images/file.png"){
                                        tip("请上传封面图片");
                                        return;
                                    };
//获取状态
                                    var bjstatus =  $(".judges input:checked").val();
// 获取出版社
                                    var bjpublisherId =$(".press select option:selected").attr("id");

                                    var bjpublisher = $(".press select option:selected").html();

//判断是否为综合书
                                    if(isall == 0){
//获取产品ID
                                        var datas =$(".produce_one option:selected").data("data");
                                        var bjproductId = "";
                                        if(datas&&datas.children){
                                            bjproductId = $(".produce_two option:selected").attr("productId");
                                        }else{
                                            bjproductId = $(".produce_one option:selected").attr("productId");
                                        }
                                        if(bjproductId ==""){
                                            tip("请选择产品类別");
                                            return;
                                        };
//获取学科学年Code
                                        var bjgradeCode = $(".bjgreads option:selected").attr("code");
                                            if(bjgradeCode ==""){
                                                tip("请选择年级");
                                                return;
                                            };
                                        var bjsubjectCode = $(".bjclasses option:selected").attr("code");
                                            if(bjsubjectCode ==""){
                                                tip("请选择学科");
                                                return;
                                            };
//获取nodeId
                                        var bjnodeId = $.trim($("#jiedian1").val());
                                            if(bjnodeId ==""){
                                                tip("请填写节点ID");
                                                return;
                                            };
//ctbcode
                                        var ctbcode = $(".bookTypeName option:selected").attr("bookTypeCode");
                                            if(ctbcode ==""){
                                                tip("请选择教材版本");
                                                return;
                                            };
//ctbName
                                        var ctbName =  $(".bookTypeName option:selected").html();
                                        params1= {
                                            "access_token":access_token,
                                            "bookName": bjbookName,
                                            "imgUrl": imgUrl,
                                            "bookId": bjbook,
                                            "productId": bjproductId,
                                            "grade": bjgradeCode,
                                            "subject": bjsubjectCode,
                                            "ctbCode": ctbcode,
                                            "status": bjstatus,		//是否上架 1:是；0:否；
                                            "ctbName": ctbName,
                                            "nodeId": bjnodeId,
                                            "publisherId":bjpublisherId,
                                            "publisher": bjpublisher,
                                            "productType": userType, 	//必选 1、同步辅导
                                            "isAll": isall 		//是否是综合书 1:是；0:否；
                                        }
                                    }else if(isall == 1){
                                        $(".judge input:first").prop("checked","checked");
                                        var bjgradeCode = $(".bjgreads1 option:selected").attr("code");
                                        if(bjgradeCode ==""){
                                            tip("请选择年级");
                                            return;
                                        };
                                        params1= {
                                            "access_token":access_token,
                                            "bookName": bjbookName,
                                            "imgUrl": imgUrl,
                                            "bookId": bjbook,
                                            "grade": bjgradeCode,
                                            "status": bjstatus,		//是否上架 1:是；0:否；
                                            "publisherId":bjpublisherId,
                                            "publisher": bjpublisher,
                                            "productType": userType, 	//必选 1、同步辅导
                                            "isAll": isall 		//是否是综合书 1:是；0:否；
                                        };
                                    };
                                    $.ajax({
                                        url: basepath + "boss/book/modify",
                                        type: "post",
                                        dataType: "json",
                                        data: {params: JSON.stringify(params1)},
                                        beforeSend: function () {
                                        },
                                        success: function (data) {
                                            if(data.httpCode == 200){
                                                params.parentId = 0;
                                                getData();
                                                tip("编辑成功");
                                                $(".content1").show().siblings().hide();
                                                $(".judge input").prop("disabled",false);
                                                $(".uncompre").show();
                                                $(".compre").hide();
                                                $(".compre .add").show();
                                                $(".compre .discipline").show();
                                                $(".content2 .btns .btn4").removeClass("edit");
                                            }else if(data.httpCode ==500){
                                                tip("服务器异常，请稍后再试");
                                            }else if(data.httpCode == 40003){
                                                tip(data.message);
                                                return;
                                            };
                                        },
                                        complete:function(){

                                        }
                                    });
                                };
                            });
                        });
//跳转查看页面
                        $(".view").on("click",function(){
                            var $this = $(this)
                            $this.prop("disabled",true);
                            setTimeout(function(){
                                $this.prop("disabled",false);
                            },1000);
                            $(".tab1 tr:first").siblings().remove();
                            var data = $(this).siblings().data("data");
                            var bookID = data.bookId;
                            params.parentId = bookID;
                            $.ajax({
                                url: basepath + "boss/book/list",
                                type: "post",
                                dataType: "json",
                                data: {params: JSON.stringify(params)},
                                success: function (data) {
                                    if(data&&data.result.list.length>0){
                                        $("#content2").show();
                                        var data = data.result.list;
                                        var html = "";
                                        $.each(data,function(i,item){
                                            html='<tr><td>'+(i+1)+'</td><td title="'+item.bookName+'">'+item.bookName+'</td><td>'+item.bookId+'</td><td>'+greadeChange(item.grade)+'</td><td>'+subjectChange(item.subject)+'</td><td>'+item.ctbName+'</td><td>'+datechange(item.updateDate,2)+'</td><td>'+item.publisher+'</td><td><button class="control1 text-info btn-link">编辑</button></td></tr>';
                                            $(".tab1").append(html);
                                            $(".control1:last").data("data",item);
                                        });
                                    }else{
                                        tip("没有子书籍数据");

                                    }

                                },
                                complete:function(){
                                    //关闭
                                    $(".info").unbind().on("click",function(){
                                        $("#content2").hide();
                                        $(".tab1 tr:first").siblings().remove();
                                    });
                                    //编辑子书籍
                                    $(".control1").on("click",function(){
                                        $(".content2 .btns .btn4").addClass("minedit");
                                        $(".content2").show().siblings().hide();
                                        relode();
                                        var data = $(this).data("data");
                                        var hxproductId = data.productId;
                                        $(".content2 .bookname .book").val(data.bookName);
                                        var hxstatus = data.status;
                                        if(hxstatus ==0){
                                            $(".judges input:first").prop("checked","checked");
                                        }else{
                                            $(".judges input:last").prop("checked","checked");
                                        };
                                        $(".judge input:first").prop("checked","checked");
                                        var url = data.imgUrl;
                                        $("#headerimg").attr("src",url);
                                        $("#jiedian1").val(data.nodeId);
                                        $('.tongbufudao option[id='+data.productType+']').prop("selected","selected");
                                        $('.publisherName option[id='+data.publisherId+']').prop("selected","selected");
                                        getBookTypes(data.grade,data.subject,bookTypeName,function(){
                                            $('.bookTypeName option').each(function(i,ele){
                                                if( $(ele).attr("booktypecode")==data.ctbcode){
                                                    $('.bookTypeName option[booktypecode='+data.ctbcode+']').prop("selected","selected");
                                                }
                                            });
                                        });
                                        $('.bjgreads option[code='+data.grade+']').prop("selected","selected");
                                        var date = data;
                                        $.ajax({
                                            url:basepath+"boss/common/get_grade_subject",
                                            type:"post",
                                            dataType:"json",
                                            success:function(data){
                                                var num = parseInt( $(".bjgreads option:selected").attr("value"));
                                                var data = data.result;
                                                var obj = [];
                                                for(key in data){
                                                    obj.push(data[key])
                                                };
                                                var results= obj[num].subjectList;
                                                var ob = [];
                                                for(key in results){
                                                    ob.push(results[key])
                                                };
                                                $.each(ob,function(i,ite){
                                                    var html = '<option code="'+(i+1)+'">'+ite+'</option>';
                                                    $(".bjclasses").append(html)
                                                });
                                                $('.bjclasses option[code='+date.subject+']').prop("selected","selected");
                                            }
                                        });
                                        var  produceDID =  $(".produce_one option:first").data("data")
                                        $.each(produceDID,function(i,item){
                                            if(item.productId ==hxproductId){
                                                $('.produce_one option[productId='+hxproductId+']').prop("selected","selected");
                                                $(".produce_two").hide();
                                            }else{
                                                $(".produce_two").show();
                                                $.each(item.children,function(x,option){
                                                    if(option.productId ==hxproductId){
                                                        $('.produce_one option').eq(i+1).prop("selected","selected");
                                                        var html = '<option productId="'+option.productId+'" selected>'+option.productName+'</option>';
                                                        $(".produce_two").append(html)
                                                    }
                                                })
                                            }
                                        });
                                        $(".content2 .bookname .book").attr("disabled",true);
                                        $(".judge input").prop("disabled",true);
                                        $(".judges input").prop("disabled",true);
                                        $(".press select").prop("disabled",true);
                                        $(".tongbufudao").prop("disabled",true);
                                        $('.bjgreads').prop("disabled",true);
                                        $("#header").prop("disabled",true);
                                        $("#content2").hide();
                                        $(".content2 .btns .minedit").text("保存");
                                        var data =$(this).data("data");
                                        var zbook = data.bookId;
                                        $(".content2 .btns .minedit").unbind().on("click",function(){
                                            if($(this).hasClass("minedit")){
                                                var $this = $(this)
                                                $this.prop("disabled",true);
                                                setTimeout(function(){
                                                    $this.prop("disabled",false);
                                                },1000);
                                                var datas =$(".produce_one option:selected").data("data");
                                                if(datas&&datas.children){
                                                    var bjproductId = $(".produce_two option:selected").attr("productId");
                                                }else{
                                                    bjproductId = $(".produce_one option:selected").attr("productId");
                                                }
                                                if(bjproductId ==""){
                                                    tip("请选择产品类別");
                                                    return;
                                                };
                                                //ctbcode
                                                var ctbcode = $(".bookTypeName option:selected").attr("bookTypeCode");
                                                if(ctbcode ==""){
                                                    tip("请选择教材版本");
                                                    return;
                                                };
                                                //ctbName
                                                var ctbName =  $(".bookTypeName option:selected").html();
                                                var bjnodeId = $.trim($("#jiedian1").val());
                                                if(bjnodeId ==""){
                                                    tip("请填写节点ID");
                                                    return;
                                                };
                                                var userType = $(".produces option:selected").attr("id");
                                                var bjsubjectCode = $(".bjclasses option:selected").attr("code");
                                                if(bjsubjectCode ==""){
                                                    tip("请选择学科");
                                                    return;
                                                };
                                                var params3 = {
                                                    "access_token": access_token,
                                                    "productType": userType, 	//必选 1、同步辅导
                                                    "bookId": zbook, 	//必选
                                                    "productId": bjproductId,  	//子书
                                                    "subject": bjsubjectCode,  	//子书
                                                    "ctbCode": ctbcode,  	//子书
                                                    "ctbName": ctbName,  	//子书
                                                    "nodeId": bjnodeId,  	//子书
                                                    "isAll":0
                                                }
                                                $.ajax({
                                                    url: basepath + "boss/book/modify",
                                                    type: "post",
                                                    dataType: "json",
                                                    data: {params: JSON.stringify(params3)},
                                                    beforeSend: function () {
//                                                        layer.open({type: 2, shadeClose: false});
                                                    },
                                                    success: function (data) {
                                                        if(data.httpCode == 200){
                                                            console.log(data);
                                                            tip("编辑成功");
                                                            $(".content2 .bookname .book").attr("disabled",false);
                                                            $(".judge input").prop("disabled",false);
                                                            $(".judges input").prop("disabled",false);
                                                            $(".press select").prop("disabled",false);
                                                            $(".tongbufudao").prop("disabled",false);
                                                            $(".bjgreads").prop("disabled",false);
                                                            $("#header").attr("disabled",false);
                                                            $(".content1").show().siblings().hide();
                                                            $(".content2 .btns .btn4").removeClass("minedit");
                                                            params.parentId = 0;
                                                            getData();
//                                                        layer.closeAll();
                                                        }else if(data.httpCode ==500){
                                                            tip("服务器异常，请稍后再试");
                                                        }else if(data.httpCode == 40003){
                                                            tip(data.message);
                                                            return;
                                                        };
                                                    },
                                                    complete:function(){

                                                    }
                                                });
                                            };
                                        });
                                    });
                                },
                                error:function(){}
                            });
                        });
//                跳转增加二维码
                        $(".export").on("click",function(){
                            $("#content3").show().siblings().hide();
                            var data = $(this).data("data");
                            var bookID = data.bookId;
                            var params4= {
                                "access_token": access_token ,
                                "bookId":bookID		//书籍编号
                            }
                            $.ajax({
                                url: basepath + "boss/book/exportQRCode",
                                type: "post",
                                dataType: "json",
                                data: {params: JSON.stringify(params4)},
                                success: function (data) {
                                    var imgurl = data.result;
                                    $(".imgs1 img").attr("src",imgurl.studentfileName);
                                    $(".imgs2 img").attr("src",imgurl.teacherfileName);
                                }
                            })
                        });
                        $(".infos").on("click",function(){
                            $("#content1").show().siblings().hide();
                        });
                    }else{
                        tip("没有数据")
                    };
                }else if(data.httpCode ==500){
                    tip("服务器异常，请稍后再试");
                };
            },
            error:function(err){
                if(err.status ==709){
                    window.sessionStorage.clear();
                    top.location.href = "./../../login/login.html";
                };
            }
        });
    };
    //刷新
    function relode(){
        $(".content2 .bookname .book").val("");
        $(".judge input:first").prop("checked","checked");
        $(".judges input:first").prop("checked","checked");
        $(".uncompre .bjgreads").children("option:first").prop("selected","selected");
        $(".uncompre .bjclasses").children("option:first").siblings().remove();
        $(".bookTypeName").children("option:first").prop("selected","selected");
        $(".bookTypeName").children("option:first").siblings().remove();
        $(".produce_one").children("option:first").prop("selected","selected");
        $(".produce_two").children("option:first").siblings().remove();
        $(".compre .bjgreads1").children("option:first").prop("selected","selected");
        $(".discipline").each(function(i,ele){
            if(i!=0){
                $(ele).remove();
            }
        });
        $(".compre .bjclasses1").children("option:first").siblings().remove();
        $(".bookTypeName1").children("option:first").prop("selected","selected");
        $(".bookTypeName1").children("option:first").siblings().remove();
        $(".produce_one1").children("option:first").prop("selected","selected");
        $(".produce_two1").children("option:first").siblings().remove();
        $(".tongbufudao").children("option:first").prop("selected","selected");
        $(".publisherName").children("option:first").prop("selected","selected");
        $("#jiedian1").val("");
        $(".jiedian0").val("");
        $("#headerimg").attr("src","../../images/file.png");
    };

//跳转新增页面
    $(".btn3").on("click",function(){
        $(".content2").show().siblings().hide();
        $(".content2 .btns .btn4").addClass("create");
        $(".content2 .btns .create").text("创建");
        relode();
        if($(".content2 .btns .btn4").hasClass("create")){
//判断是否为综合书
            $(".judge").change(function(){
                 isAll = $(".judge input:checked").val();
                if(isAll == 0){
                    $(".uncompre").show();
                    $(".compre").hide();
                }else if(isAll == 1){
                    $(".uncompre").hide();
                    $(".compre").show();
                }
            });
//添加子书数量
        $(".add").unbind().on("click",function(){
            var discipline = $(".discipline").eq(0).clone(true);
              $(".discipline").last().after(discipline);
              $(".discipline:last").find(".jiedian0").val("");
        });
//删除子书数量
            $(".glyphicon-remove").unbind().on("click",function(){
                if($(".discipline").length>1){
                    $(this).closest(".discipline").remove();
                }else{
                   tip("不可删除最后的数据信息")
                   return;
                }
            });
//创建数据列表
            $(".content2 .btns .create").unbind().on("click",function(){
                var $this = $(this)
                $this.prop("disabled",true);
                setTimeout(function(){
                    $this.prop("disabled",false);
                },1000);
//获取书名
                var bjbookName = $(".content2 .bookname .book").val();
                if(bjbookName.trim()==""){
                    tip("书籍名称不能为空");
                    return;
                };
//获取产品类型
                var userType = $(".produces option:selected").attr("id");
//获取图片路径
                var imgUrl = $(".file img").attr("src");
                    if(imgUrl ==""||imgUrl == "../../images/file.png"){
                        tip("请上传封面图片");
                        return;
                    };
//获取状态
                var status =  $(".judges input:checked").val();
//获取出版社
                var bjpublisherId = $(".press select option:selected").attr("id");

                var bjpublisher = $(".press select option:selected").html();

                var params2 = {};
                if(isAll == 0){
                    //获取学科学年Code
                    var bjgradeCode = $(".bjgreads option:selected").attr("code");
                        if(bjgradeCode ==""){
                            tip("请选择年级");
                            return;
                        };
                    var bjsubjectCode = $(".bjclasses option:selected").attr("code");
                        if(bjsubjectCode ==""){
                            tip("请选择学科");
                            return;
                        };

                    //ctbcode
                    var ctbcode = $(".bookTypeName option:selected").attr("bookTypeCode");
                        if(ctbcode ==""){
                            tip("请选择教材版本");
                            return;
                        };
                    //ctbName
                    var ctbName =  $(".bookTypeName option:selected").html();
                    //获取产品ID
                    var datas =$(".produce_one option:selected").data("data");

                    var bjproductId ="";
                        if(datas&&datas.children){
                            bjproductId = $(".produce_two option:selected").attr("productId");
                        }else{
                            bjproductId = $(".produce_one option:selected").attr("productId");
                        }
                        if(bjproductId ==""){
                            tip("请选择产品类別");
                            return;
                        };
                    //获取nodeId
                    var bjnodeId = $.trim($("#jiedian1").val());
                        if(bjnodeId ==""){
                            tip("请填写节点ID");
                            return;
                        };
                    params2= {
                        "access_token":access_token,
                        "bookName": bjbookName,
                        "imgUrl": imgUrl,
                        "productId": bjproductId,
                        "grade": bjgradeCode,
                        "subject": bjsubjectCode,
                        "ctbCode": ctbcode,
                        "status": status,		//是否上架 1:是；0:否；
                        "ctbName": ctbName,
                        "nodeId": bjnodeId,
                        "publisherId": bjpublisherId,
                        "publisher": bjpublisher,
                        "productType": userType, 	//必选 1、同步辅导
                        "isAll": isAll 		//是否是综合书 1:是；0:否；
                    }
                }else if(isAll == 1){
                    var bjgradeCode1 = $(".bjgreads1 option:selected").attr("code");
                        if(bjgradeCode1 == ""){
                            tip("请选择年级");
                            return;
                        };
                    params2= {
                        "access_token":access_token,
                        "bookName": bjbookName,
                        "imgUrl": imgUrl,
                        "grade": bjgradeCode1,
                        "subject": "-1",
                        "status": status,		//是否上架 1:是；0:否；
                        "publisherId": bjpublisherId,
                        "publisher": bjpublisher,
                        "productType": userType, 	//必选 1、同步辅导
                        "isAll": isAll, 		//是否是综合书 1:是；0:否；
                        "children": [	//isAll值为1是必选（子书列表）
                        ]
                    }
                //获取学科学年Code

                    var bjsubjectCode1 = "";
                    var ctbcode1 = "";
                    var bjproductId1 ="";
                    var bjnodeId1 = "";
                    var len = $(".discipline").length;

                        for(var i=0;i<len;i++){
                            var obj ={};
                            bjsubjectCode1 = $(".bjclasses1").eq(i).children("option:selected").attr("code");
                                if(bjsubjectCode1 ==""){
                                    tip("请选择学科");
                                    return;
                                }else{
                                    obj.subject = bjsubjectCode1;
                                };
                            ctbcode1 = $(".bookTypeName1").eq(i).children("option:selected").attr("booktypecode");

                                if(ctbcode1 ==""){
                                    tip("请选择教材版本");
                                    return;
                                }else{
                                    obj.ctbCode =  ctbcode1;
                                };
                            obj.ctbName = $(".bookTypeName1").eq(i).children("option:selected").html();

                            var datas1 = $(".produce_one1").eq(i).children("option:selected").data("data");
                                if(datas1&&datas1.children){
                                    bjproductId1= $(".produce_two1").eq(i).children("option:selected").attr("productId");
                                }else{
                                    bjproductId1 = $(".produce_one1").eq(i).children("option:selected").attr("productId");
                                };
                                if(bjproductId1 ==""){
                                    tip("请选择产品类別");
                                    return;
                                }else{
                                    obj.productId = bjproductId1;
                                };

                            bjnodeId1 = $.trim($(".jiedian0").eq(i).val());
                                if(bjnodeId1 ==""){
                                    tip("请填写节点ID");
                                    return;
                                }else{
                                    obj.nodeId =bjnodeId1;
                                };
                            params2.children.push(obj);
                        };
                                if(params2.children.length==1){
                                    tip("添加子书至少俩本以上");
                                  return;
                                };

                }
                $.ajax({
                    url: basepath + "boss/book/add",
                    type: "post",
                    dataType: "json",
                    data: {params: JSON.stringify(params2)},
                    beforeSend: function () {
//                        layer.open({type: 2, shadeClose: false});
                    },
                    success: function (data) {
                        if(data.httpCode ==200){
                            console.log(data);
                            $(".content1").show().siblings().hide();
                            $(".content2 .btns .btn4").removeClass("create");
                            params.parentId = 0;
                            getData();
                            tip("创建成功");
                            $(".uncompre").show();
                            $(".compre").hide();
                        }else if(data.httpCode ==500){
                            tip("服务器异常，请稍后再试");
                        }else if(data.httpCode ==40003){
                            tip(data.message);
                            return;
                        }
                    },
                    complete: function () {

                    }
                });
            });
        };
    });
//根据年级学科获取教材版本
    $(".bjclasses").change(function(){
        var greadCode = $(".bjgreads option:selected").attr("code");
        var subjectCode = $(".bjclasses option:selected").attr("code");
        getBookTypes(greadCode,subjectCode,bookTypeName);
    });
    $(".discipline").delegate(".bjclasses1","change",function(){
        var greadeCode1 = $(".bjgreads1 option:selected").attr("code");
        var subjectCode1 = $(this).children("option:selected").attr("code");
        var bookTypeName1 = $(this).closest('.discipline').find(".bookTypeName1");
        getBookTypes(greadeCode1,subjectCode1,bookTypeName1);
    });
    function getBookTypes(gradeCode,subjectCode,bookTypeName,funC){
        bookTypeName.children("option:first").siblings().remove();
        if(gradeCode!=""&&subjectCode!=""){
            var params0 = {
                "access_token":access_token,
                "grade": gradeCode,
                "subject": subjectCode
            };
            $.ajax({
                url: basepath + "boss/book/getBookType",
                type: "post",
                dataType: "json",
                data: {params: JSON.stringify(params0)},
                success: function (data) {
                    var data = data.result;
                    $.each(data,function(i,item){
                        var html = '<option bookTypeCode="'+item.bookTypeCode+'">'+item.bookTypeName+'</option>';
                        bookTypeName.append(html)
                    });
                    funC&&funC();
                }
            });
        }else{
        tip("获取年级学科不完全");
        }
    }
    ;
//获取产品类别
    getproduct();
    function getproduct(){
        $.ajax({
            url:basepath+"boss/book/getBaseData",
            type:"post",
            dataType:"json",
            data:{params:JSON.stringify(params)},
            success:function(data) {
                console.log(data);
//                    Object {bookPublishers: Array(1), bookProductTypes: Array(2), productTypes: Array(5)}
                var data1 = data.result.productTypes;
                var data2 = data.result.bookPublishers;
                var data3 = data.result.bookProductTypes;
                $.each(data3,function(i,item){
                    var html = '<option id="'+item.id+'">'+item.productTypeName+'</option>';
                    $(".counselling").append(html);
                    $(".tongbufudao").append(html);
                });
                $(".produce_one option:first").data("data",data1);
                $.each(data2,function(i,item){
                    var html = '<option id="'+item.id+'">'+item.publisherName+'</option>';
                    $(".publisherName").append(html)
                });
                $.each(data1,function(i,item){
                    var html = '<option productId="'+item.productId+'"parentId="'+item.parentId+'">'+item.productName+'</option>';
                    $(".produce_one").append(html);
                    $(".produce_one1").append(html);
                    $(".produce_one2").append(html);
                    $(".produce_one option:last").data("data",item);
                    $(".produce_one1 option:last").data("data",item);
                    $(".produce_one2 option:last").data("data",item);
                });
                $(".produce_one").change(function(){
                    var data =$(".produce_one option:selected").data("data");
                    $(".produce_two").children("option:first").siblings().remove();
                    if(data.children){
                        var data = data.children;
                        $(".produce_two").show();
                        $.each(data,function(i,item){
                            var html = '<option productId="'+item.productId+'"parentId="'+item.parentId+'">'+item.productName+'</option>';
                            $(".produce_two").append(html)
                        });
                    }else{
                        $(".produce_two").hide();
                    };
                })
                $(".discipline").delegate(".produce_one1","change",function(){
                    var data =$(this).children("option:selected").data("data");
                    var produce_two1 = $(this).closest(".discipline").find(".produce_two1");
                    produce_two1.children("option:first").siblings().remove();
                    if(data.children){
                        var data = data.children;
                        produce_two1.show();
                        $.each(data,function(i,item){
                            var html = '<option productId="'+item.productId+'"parentId="'+item.parentId+'">'+item.productName+'</option>';
                            produce_two1.append(html)
                        });
                    }else{
                        produce_two1.hide();
                    }
                })
            },
            error:function(err){
                tip(err.message);
            }
        })
    }

//        取消
    $(".content2 .btns .btn5").unbind().on("click",function(){
        $(".content2").hide();
        $(".content1").show();
        $(".uncompre").show();
        $(".compre").hide();
        $(".compre .add").show();
        $(".compre .discipline").show();
        $(".content2 .btns .btn4").removeClass("create");
        $(".content2 .btns .btn4").removeClass("edit");
        $(".content2 .btns .btn4").removeClass("minedit");
        $(".content2 .bookname .book").attr("disabled",false);
        $(".judge input").prop("disabled",false);
        $(".judges input").prop("disabled",false);
        $(".press select").prop("disabled",false);
        $(".tongbufudao").prop("disabled",false);
        $(".bjgreads").prop("disabled",false);
        $("#header").attr("disabled",false);
    });
//重置
    $(".btns .btn2").on("click",function(){
        $(".search").children('option:first').prop("selected","selected");
        $(".headerinput input").val("");
        $(".greads").children('option:first').prop("selected","selected");
        $(".classes").children('option:first').prop("selected","selected");
        $(".counselling").children('option:first').prop("selected","selected");
        $(".content1 .status").children('option:first').prop("selected","selected");
        $(".tab tr:first").siblings().remove();
        relode();
        pageNum = 1;
        params= {
            "access_token": access_token,
            "parentId": 0,	//可选 综合书书籍ID（查询综合书下的子书时传参）
            "pageNum": pageNum, 		//可选
            "pageSize": pageSize		//可选
        };
        getData();
    });
    //分页查询 初始化
    function page(){
        //生成分页
        kkpager.total = totalPage;
        kkpager.totalRecords = totalRecords;
        //有些参数是可选的，比如lang，若不传有默认值
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
    };
})


