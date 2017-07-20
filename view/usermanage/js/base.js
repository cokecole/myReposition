/**
 * Created by ZDD on 2017/6/18.
 */
var basepath = 'http://textbooktest.e-edusky.com';
function errorCode(error){
    if(error.status == '709'){
        tip("用户已过期")
        layer.closeAll();
        window.sessionStorage.removeItem("access_token");
        window.sessionStorage.removeItem("username");
        top.location.href="../../login/login.html";
    }
    console.log(error);
    return
}
//请求发送未失败
function httpcodeServer(a){
    layer.closeAll();
    if(a=='500'){
        layer.closeAll();
        tip('服务器异常，请稍后再试')
        return
    }
}
//删除三级联动省 港澳台
function clearProvince(){
    $('option[value="710000"]').remove();
    $('option[value="810000"]').remove();
    $('option[value="820000"]').remove();
}