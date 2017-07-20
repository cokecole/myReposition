/**
 * Created by Administrator on 2017/6/13.
 */
(function ($) {

    $.fn.sidebarMenu = function (options) {
        var rank = 0;
        options = $.extend({}, $.fn.sidebarMenu.defaults, options || {});
        var target = $(this);
        target.addClass('nav');
        target.addClass('nav-list');
        if (options.data) {
            init(target, options.data,rank);
        }
        else {
            if (!options.url) return;
            $.getJSON(options.url, options.param, function (data) {
                init(target, data,ranks);
            });
        }
        var url = window.location.pathname;
        function init(target, data,ranks) {
            $.each(data, function (i, item) {
                var li = $('<li></li>');
                var a = $('<a  class="title" onoff=true iden="'+item.class+'" rank="'+ ranks +'"></a>');
                var icon = $('<i></i>');
                icon.addClass(item.icon);
                var text = $('<span></span>');
                text.addClass('menu-text').text(item.text);
                a.append(icon);
                a.append(text);
                var href = 'javascript:addTabs({id:\'' + item.id + '\',title: \'' + item.text + '\',close: true,url: \'' + item.url + '\'});';
                a.attr('href', href);
                li.append(a);
                if (item.menus&&item.menus.length>0) {
                    a.addClass('dropdown-toggles');
                    li.append(a);
                    var menus = $('<ul></ul>');
                    menus.addClass('submenu');
                    init(menus, item.menus,++rank);
                    li.append(menus);
                    rank = 0;
                }
                target.append(li);
            });
            //隐藏子项
            $(".title").each(function(){
                if($(this).attr("rank")!="0"){
                    $(this).parent().parent().hide();
                }
            })
        }
        //渐变效果
        $(".title").on("click",function(){
           var $this = $(this);
            if($this.attr("onoff") =="true"){
               $this.siblings().slideDown();
               $this.attr('onoff','false');
            }else{
                $this.siblings().slideUp();
                $this.attr('onoff','true');
            }
        })

    }

    $.fn.sidebarMenu.defaults = {
        url: null,
        param: null,
        data: null
    };







})(jQuery)