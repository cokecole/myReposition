function judge(ob){
    if(ob == 0){
        return "未上架";
    }else if(ob == 1){
        return "已上架";
    }
};
function judgeIs(ob){
    if(ob == 0){
        return "否";
    }else if(ob == 1){
        return "是";
    }
};

function judgeNull(obj){
    if(obj == null||obj ==""){
        return "无";
    }else{
        return obj;
    }
}

//返回支付状态
function transzf(obj){
    if(obj == 0){
        return "待支付";
    }else if(obj == 1){
        return "支付成功";
    }else{
        return "支付失败";
    }
}
//日期格式
function datechange(time, type, split) {
    if (time == null) {
        return "";
    }
    //time为毫秒数
    //split 为日期的划分样式
    //2017/3/21;type为1时
    //2017/3/21   19:00;type为2时
    var Datetoo = new Date(time);
    var year = Datetoo.getFullYear();
    var month = Datetoo.getMonth() + 1;
    var date = Datetoo.getDate();
    var split = split ? split : "/";
    var hours = Datetoo.getHours();
    var minutes = Datetoo.getMinutes();
    if (type == 1 || type == undefined) {
        return year + split + month + split + date;
    } else {
        return year + split + month + split + date + "  " + hours + ":" + minutes;
    }

    if (time == null) {
        return ""
    }
}
//转变学年学科
function greadeChange(greadCode){
    switch (greadCode){
        case 11:
            return "一年级"
            break;
        case 12:
            return "二年级"
            break;
        case 13:
            return "三年级"
            break;
        case 14:
            return "四年级"
            break;
        case 15:
            return "五年级"
            break;
        case 16:
            return "六年级"
            break;
        case 21:
            return "七年级"
            break;
        case 22:
            return "八年级"
            break;
        case 23:
            return "九年级"
            break;
        case 24:
            return "中考"
            break;
        case 31:
            return "高一"
            break;
        case 32:
            return "高二"
            break;
        case 33:
            return "高考"
            break;
    };
};
//转变学年学科
function subjectChange(subjectCode){
    switch (subjectCode){
        case 1:
            return "语文"
            break;
        case 2:
            return "数学"
            break;
        case 3:
            return "英语"
            break;
        case 4:
            return "物理"
            break;
        case 5:
            return "化学"
            break;
        case 6:
            return "生物"
            break;
        case 7:
            return "历史"
            break;
        case 8:
            return "地理"
            break;
        case -1:
            return "综合"
            break;
    };
};
