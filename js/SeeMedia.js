/**
 * Created by kezunchao on 2015/5/1.
 * Modified by re on 2015/7/22.
 *
 * Function:
 *          1.View photos;
 *          2.You can rotate photo.
 *  Care: It rely on 'jQuery.js'.
 *  Description:{
 *                  $target:目标容器,
 *                  attaches;[{url:''}],//附件数组,数组元素至少包含url属性
 *                  index:0,//图片的索引,也就是attaches的下标,默认为0,(可选参数)
 *                  width:指定宽(可选,不传默认是$target的宽),
 *                  height:指定高(可选,不传默认是$target的高),
 *                  closeBtn:true/false(可选,true:有关闭按钮,反之没有)
 *              }
 */

SeeMedia = Class({
    $target: null,//目标容器
    attaches: [],//附件
    index: 0,//图片的索引,也就是attaches的下标,默认为0
    $picContainer: null,
    width: 800,
    height: 600,
    zIndex: 99999,
    degree: 0,
    $mask: null,
    switchBtn: true,

    closeBtn:null,
    prevBtn:null,
    nextBtn:null,

    initialize: function (option) {
        $.ecity.extend(this, option);
        if (!this.$target) {
            console && console.error("Can't find target-container!");
            return;
        }
        if (this.attaches.length == 0) {
            console && console.error("The length of attaches must be above 0");
            return;
        }
        if (!option.width) {
            this.width = this.$target.width();
        }
        if (!option.height) {
            this.height = this.$target.height();
        }

        this.createHtml();
    },
    createHtml: function () {
        var that = this;
        var maskWidth = that.width;
        var maskHeight = that.height;
        that.$mask = $('<div class="lookPhotoMask"></div>')
            .css({
                zIndex: that.zIndex,
                position: 'absolute',
                left: that.$target.offset().left + 0,
                top: that.$target.offset().top + 0,
                width: maskWidth,
                height: maskHeight,
                backgroundColor: 'gray',
                borderRadius: 4,
                opacity: 0.9
            }
        ).appendTo(that.$target);
        that.$picContainer = $('<div></div>')
            .css({
                zIndex: that.zIndex + 1,
                position: 'absolute',
                textAlign: 'center',
                left: 0,
                top: 0,
                width: maskWidth,
                height: maskHeight,
                lineHeight: maskHeight - 6 + 'px'
            }).appendTo(that.$mask);
        (that.switchBtn) && (that.$picContainer.mouseover(function () {
            $('.prevBtn,.nextBtn').show();
        }).mouseout(function () {
            $('.prevBtn,.nextBtn').hide();
        }));
        $('<img class="photo" alt="图片可能已损坏或者不是图片资源　"/>').css({
            'vertical-align': 'middle',
            maxWidth: maskWidth,
            maxHeight: maskHeight
        }).appendTo(that.$picContainer);
        var closeParam = {
            text: '×',
            title: '关闭',
            css: {
                zIndex: that.zIndex + 1,
                color: '#ffffff',
                textAlign: 'center',
                borderRadius: 50,
                position: 'absolute',
                right: 10, top: 10,
                fontSize: 24,
                fontWeight: 'bold',
                width: 30,
                lineHeight: '30px',
                height: 30,
                cursor: 'pointer'
            },
            tag: that.$mask
        };


        var prevParam = {
            text: '<',
            title: '上一张',
            css: {
                display: 'none',
                fontFamily: 'SimSun,serif',
                zIndex: that.zIndex + 1,
                color: '#555555',
                textAlign: 'center',
                border: '1px solid #fff',
                boxShadow: 'gray 0px 0px 2px',
                borderRadius: 50,
                position: 'absolute',
                left: 10, top: maskHeight * 0.4,
                fontSize: 46,
                fontWeight: 'bolder',
                width: 50,
                height: 50,
                lineHeight: '53px',
                cursor: 'pointer'
            },
            tag: that.$picContainer
        };

        that.closeBtn = $('<div class="closeBtn"></div>').text(closeParam.text).attr('title', closeParam.title).css(closeParam.css).appendTo(closeParam.tag);

        that.prevBtn = $('<div class="prevBtn"></div>').text(prevParam.text).attr('title', prevParam.title).css(prevParam.css).appendTo(prevParam.tag);

        var nextParam = $.extend(prevParam, {text: '>', title: '下一张'});
        nextParam['css'].left = maskWidth * 0.98 - 60;
        that.nextBtn = $('<div class="nextBtn"></div>').text(nextParam.text).attr('title', nextParam.title).css(nextParam.css).appendTo(nextParam.tag);
        that.bindEvent();
        that.loadPhoto(that.index);
    },
    bindEvent: function () {
        var that = this;
        that.closeBtn.hover(function () {
                $(this).css('background-color', '#c25a57');
            }, function () {
                $(this).css('background-color', 'transparent');
            })
            .click(function () {
                that.$mask.remove();
            });
        that.prevBtn.click(function () {
                if (that.index <= 0) {
                    return;
                }
                that.index--;
                that.loadPhoto(that.index);
            });
        that.nextBtn.click(function () {
            if (that.index >= (that.attaches.length - 1)) {
                return;
            }
            that.index++;
            that.loadPhoto(that.index);
        });
        that.$picContainer.find('.photo').dblclick(function (e) {
            that.degree += 90;
            that.rotate(e.currentTarget, that.degree);
        });
    },
    loadPhoto: function (index) {
        var $img = this.$picContainer.find('.photo');
        this.rotate($img[0], 0);
        $img.attr('src', this.attaches[index].url);

    },

    //图片旋转有待优化
    rotate: function (dom, degree) {
        var that = this;
        var userAgent = navigator.userAgent;
        var isIE = /msie/i.test(userAgent) && !window.opera;
        var isWebKit = /webkit/i.test(userAgent);
        var isFirefox = /firefox/i.test(userAgent);
        if (isWebKit) {
            dom.style.webkitTransform = "rotate(" + degree + "deg)";
        } else if (isFirefox) {
            dom.style.MozTransform = "rotate(" + degree + "deg)";
        } else if (isIE) {
            degree = degree / 180 * Math.PI;
            var sinDeg = Math.sin(degree);
            var cosDeg = Math.cos(degree);
            dom.style.filter = "progid:DXImageTransform.Microsoft.Matrix(" +
            "M11=" + cosDeg + ",M12=" + (-sinDeg) + ",M21=" + sinDeg + ",M22=" + cosDeg + ",SizingMethod='auto expand')";
        } else {
            dom.style.transform = "rotate(" + degree + "deg)";
        }

        if (degree % 180 == 0) {
            $(dom).css({
                maxWidth: that.width,
                maxHeight: that.height
            });
        } else {
            $(dom).css({
                maxWidth: that.height
                //maxHeight:that.height
            });
        }

    }
});

