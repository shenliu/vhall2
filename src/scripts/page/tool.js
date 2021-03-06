/**
 * Created by shen on 2016/7/14.
 */

"use strict";

import {Constant} from './constant';

const base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const base64DecodeChars = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44,
    45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];

/**
 * base64编码
 * @param {Object} str
 */
function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

/**
 * base64解码
 * @param {Object} str
 */
function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        }
        while (i < len && c1 == -1);
        if (c1 == -1)
            break;
        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        }
        while (i < len && c2 == -1);
        if (c2 == -1)
            break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
                return out;
            c3 = base64DecodeChars[c3];
        }
        while (i < len && c3 == -1);
        if (c3 == -1)
            break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
                return out;
            c4 = base64DecodeChars[c4];
        }
        while (i < len && c4 == -1);
        if (c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

/**
 * utf16转utf8
 * @param {Object} str
 */
function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        }
        else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
        else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}

/**
 * utf8转utf16
 * @param {Object} str
 */
function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = str.length;
    i = 0;
    while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += str.charAt(i - 1);
                break;
            case 12:
            case 13:
                // 110x xxxx 10xx xxxx
                char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx10xx xxxx10xx xxxx
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                break;
        }
    }
    return out;
}

/**
 * 随机得到指定范围中的一个数字 包括这个范围本身
 * @param start
 * @param end
 * @returns {number}
 */
function random(start, end) {
    var n = end - start + 1;
    return Math.floor(Math.random() * n + start);
}

/**
 * 去除str中的HTML标签 返回纯文本
 * @param str HTML文本
 * @returns {string}
 */
function stripHTML(str) {
    var reg = /<(?:.|\s)*?>/g;
    return str.replace(reg, "");
}

function getUrlParam(name, str) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = str.match(reg);
    if (r != null)
        return decodeURI(r[2]);
    return null;
}

function dateFormat(date, fmt) {
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function dropdown() {
    $(".vh-username").html($.cookie("username"));
    $(".ui.dropdown").dropdown();
}

/**
 * 播放流媒体 该函数被export 用在gallery页面中
 * @param domain
 * @param id
 */
function playStream(domain, id) {
    let hash, url;

    domain = domain.replace(/_wap/g, ""); // 去掉所有_wap

    if (domain.indexOf("rtmp") !== -1) { // rtmp
        // 格式: rtmp://domain/vhall/id
        hash = ["rtmp://", domain, "/vhall/", id];
        url = './player/srs.html#' + hash.join("");
    } else if (domain.indexOf("hls") !== -1) { // hls
        // 格式: http://cn_domain/vhall/id/livestream.m3u8
        // 格式: http://cc_domain/vhall/id/index.m3u8
        var suffix = domain.startsWith("cc") ? "/index.m3u8" : "/livestream.m3u8";
        hash = ["http://", domain, "/vhall/", id, suffix];
        url = './player/jwp.html#' + hash.join("");
    }

    if (url) {
        var modal = $(".ui.modal.vh-modal-player");
        modal.modal({
            closable: true,
            onShow: function() {
                $('.ui.embed').embed({
                    url: encodeURI(url)
                });
            },
            onVisible: function() {
                modal.modal("refresh");
            },
            onHide: function() {
                var ifr = $("iframe")[0];
                ifr.contentWindow.player_stop();
                $('.ui.embed').find(".embed").remove();
            }
        })
            .modal('setting', 'transition', "slide down")
            .modal('show').modal("refresh");
    }
}

/*
 * 获得时间差,时间格式为 年-月-日 小时:分钟:秒 或者 年/月/日 小时：分钟：秒
 * 其中，年月日为全格式，例如 ： 2010-10-12 01:00:00
 * 返回精度为：秒，分，小时，天
 *
 * getDateDiff("2010-02-26 16:00:00", "2011-07-02 21:48:40", "day");
 * getDateDiff("2010-02-26 16:00:00", "2011-07-02 21:48:40", "second");
 */
function getDateDiff(startTime, endTime, diffType) {
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");
    //将计算间隔类性字符转换为小写
    diffType = diffType.toLowerCase();
    var sTime = new Date(startTime);      //开始时间
    var eTime = new Date(endTime);  //结束时间
    //作为除数的数字
    var divNum = 1;
    switch (diffType) {
        case "second":
            divNum = 1000;
            break;
        case "minute":
            divNum = 1000 * 60;
            break;
        case "hour":
            divNum = 1000 * 3600;
            break;
        case "day":
            divNum = 1000 * 3600 * 24;
            break;
        default:
            break;
    }
    return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
}

export var Tool = {
    xhr_get: function (url, done, fail) {
        return $.ajax({
            type: "GET",
            url: url,
            dataType: "json"
            //,data: JSON.stringify(query),
            //contentType: "application/json"
        }).done(function (data, textStatus, jqXHR) {
            done(data, textStatus, jqXHR);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            fail && fail(jqXHR, textStatus, errorThrown);
        });
    },

    xhr_post: function(url, data, done, fail) {
        return $.ajax({
            type: "POST",
            url: url,
            dataType: "json"
            ,data: JSON.stringify(data),
            //contentType: "application/json"
        }).done(function (data, textStatus, jqXHR) {
            done(data, textStatus, jqXHR);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            fail && fail(jqXHR, textStatus, errorThrown);
        });
    },

    /*
     * 初始化Message module
     */
    initMessage: function() {

    },

    getMessage: (key) => Constant.message[key],

    getFullMessage: (key) => key + " " + Constant.message[key],

    getMessages: () =>Constant.message,

    getModule: (key) => Constant.modules[key],

    getModules: () => Constant.modules,

    stripHTML: stripHTML,

    random: random,

    urlParam: getUrlParam,

    dateFormat: dateFormat,

    base64: {
        encode: (value) => base64encode(utf16to8(value)),
        decode: (value) => utf8to16(base64decode(value))
    },

    dropdown: dropdown,

    playStream: (domain, id) => playStream(domain, id),

    // 根据对象的值 找到对应的键值
    getKey: function(obj, val) {
        for (var key of Object.keys(obj)) {
            if (obj[key] === val) {
                return key;
            }
        }
    },

    /**
     * 显示loading
     * @param dom   在dom上显示
     */
    loading: {
        begin: function(_dom) {
            var dom = $(_dom);
            var html = ['<div class="loader">'];
            html.push('<div class="loading">');
            html.push('<div class="dot"></div>');
            html.push('<div class="dot"></div>');
            html.push('<div class="dot"></div>');
            html.push('<div class="dot"></div>');
            html.push('<div class="dot"></div>');
            html.push('</div>');
            html.push('</div>');
            var div = $("<div class='mask'></div>").css({
                "width": dom.width() + "px",
                "height": dom.height() + "px"
            }).html(html.join("")).appendTo(dom);

            dom.css("position", "relative");

            div.find(".loader").css({
                "marginTop": (dom.height() - 64) / 2 + "px"
            });
        },

        end: function(dom) {
            $(dom).remove(".mask");
        }
    },

    diffTime: (startTime, endTime, diffType) => getDateDiff(startTime, endTime, diffType)
};
