"use strict";

require("semantic/semantic.min.css");
require("../../css/common/common.less");
require("../../css/page/monitor.less");
require("../../css/page/error_stat.less");

import * as _ from 'lodash';

var E = require("echarts/dist/echarts.min");

import {Constant} from './constant';

import {Tool} from './tool';

var errorStatData = {}; // {"17:52:00": {"1": {"14001": 32}}}

var curModule; // 当前点击饼图后的模块id
var curCode; // 当前点击饼图后的错误代码code

// init
$(function () {
    monitor_error_overview();
    monitor_error_oneday_log();
    monitor_error_oneday();
    Tool.dropdown();
});

function monitor_error_overview() {
    Tool.xhr_get(Constant.url.monitor_error_stat_overview, function (data, textStatus, jqXHR) {
        var times = [], // 时间轴
            mods = [], // 模块 也是legend
            series = [],
            dataArr = []; // 存放刻个时间段对应的数据 { "1": { "24303": "44" }, ... }
        $.each(data, function(k, v) { // k: "2016073119"  v: { "1": { "24303": "44" }, ... }
            var time = k.replace(/(\d{4})(\d{2})(\d{2})(\d{2})/, "$1/$2/$3 $4:00");
            times.push(time);

            $.each(v, function(x, y) { // x: "1"   y: {"24303": "44", ...}
                if (_.indexOf(mods, x) === -1) {
                    mods.push(x); // 所有可能的模块
                }
            });

            dataArr.push(v);
        });

        var modNumber = {};  // 各个模块按时间的错误数 {"1": [2, 0, 5, ...], ...}
        $(dataArr).each(function(idx, o) { // o: { "1": { "24303": "44" }, ... }
            $(mods).each(function (i, item) {
                if (!(item in modNumber)) {
                    modNumber[item] = [];
                }
                var obj = o[item]; // {"64001": "2", "64002": "178", ...}
                var num = (obj && _.reduce(obj, function(result, value, key) {
                        return parseInt(result, 10) + parseInt(value, 10);
                    }, 0)) || 0;
                modNumber[item].push(num);
            });
        });

        $.each(mods, function (i, o) {
            series.push({
                name: Tool.getModule(mods[i]),
                type: "bar",
                stack: '总量',
                data: modNumber[o]
            });
        });

        var dom = $(".vh-error-stat-overview")[0];
        mods = $(mods).map(function() {
            return Tool.getModule(this);
        });

        graph_bar(dom, times, mods, series, null);

    }, null);
}

/**
 * 第二个柱状图
 */
function monitor_error_oneday_log() {
    let times = []; // x轴 时间
    let datas = {}; // 数据
    let mods = []; // 模块

    Tool.xhr_get(Constant.url.monitor_error_stat_error_mod_oneday, function (data, textStatus, jqXHR) {
        $(data).each(function (idx, elem) { // idx: 0,1,2... elem: {"2": { "24101": 5, "24303": 2 }, ...}
            if (!("timestamp" in elem)) {
                return true;
            }
            times.push(elem["timestamp"]);
            delete elem["timestamp"]; // 删除timestamp属性

            for (var k in elem) {
                if (_.indexOf(mods, k) === -1) {
                    mods.push(k);
                }
            }
        });

        $(data).each(function (idx, elem) { // idx: 0,1,2... elem: {"2": { "24101": 5, "24303": 2 }, ...}
            if ($.isEmptyObject(elem)) {
                return true;
            }
            $(mods).each(function(i, mod) {
                var o = elem[mod];
                if (!(mod in datas)) {
                    datas[mod] = [];
                }
                var num = (o && _.reduce(o, function(result, value, key) {
                        return parseInt(result, 10) + parseInt(value, 10);
                    }, 0)) || 0;
                datas[mod].push(num);
            });
        });

        let series = [];
        $.each(datas, function (k, v) {
            series.push({
                name: Tool.getModule(k),
                type: "bar",
                stack: '总量',
                data: v
            });
        });
        let legend = _.map(_.keys(datas), function (i) {
            return Tool.getModule(i);
        });
        let dom = $(".vh-error-stat-error-mod-oneday")[0];

        graph_bar(dom, times, legend, series, error_mod_event);
    }, null);
}

/**
 * 点击第二个柱状图 事件 - 第三个柱状图
 * @param myChart
 */
function error_mod_event(myChart) {
    myChart.on("click", function (params) {
        var seriesName = params.seriesName;
        var mod = Tool.getKey(Tool.getModules(), seriesName);

        if (!mod) {
            return;
        }

        let times = []; // x轴 时间
        let datas = {}; // 数据
        let codes = []; // 错误代码

        let url = Constant.url.monitor_error_stat_error_code_oneday.replace("{mod}", mod);
        Tool.xhr_get(url, function (data, textStatus, jqXHR) {
            $(data).each(function (idx, elem) { // idx: 0,1,2... elem: { "24101": 5, "24303": 2 }
                if (!("timestamp" in elem)) {
                    return true;
                }
                times.push(elem["timestamp"]);
                delete elem["timestamp"]; // 删除timestamp属性

                for (var k in elem) {
                    if (_.indexOf(codes, k) === -1) {
                        codes.push(k);
                    }
                }
            });

            $(data).each(function (idx, elem) { // idx: 0,1,2... elem: { "24101": 5, "24303": 2 }
                if ($.isEmptyObject(elem)) {
                    return true;
                }
                $(codes).each(function(i, code) {
                    var n = elem[code] || 0;
                    if (!(code in datas)) {
                        datas[code] = [];
                    }
                    datas[code].push(n);
                });
            });

            let series = [];
            $.each(datas, function (k, v) {
                series.push({
                    name: k + " " + Tool.getMessage(k),
                    type: "bar",
                    stack: '总量',
                    data: v
                });
            });
            let legend = _.map(_.keys(datas), function (i) {
                return i + " " + Tool.getMessage(i);
            });
            let dom = $(".vh-error-stat-error-code-oneday")[0];

            // 销毁上一个图型
            var instance = E.getInstanceByDom(dom);
            if (instance) {
                instance.dispose();
                var _dom = $(".vh-error-stat-error-host-oneday");
                instance = E.getInstanceByDom(_dom[0]);
                instance && instance.dispose();
            }

            graph_bar2(dom, times, legend, series, seriesName, error_code_event);
        }, null);
    });
}

/**
 * 点击第三个柱状图 事件 - 第四个柱状图
 * @param myChart
 */
function error_code_event(myChart) {
    myChart.on("click", function (params) {
        var codeName = params.seriesName;

        let times = []; // x轴 时间
        let datas = {}; // 数据
        let hosts = []; // 主机

        let url = Constant.url.monitor_error_stat_error_host_oneday.replace("{code}", codeName.split(" ")[0]);
        Tool.xhr_get(url, function (data, textStatus, jqXHR) {
            $(data).each(function (idx, elem) { // idx: 0,1,2... elem: { "xxx.com": 5, "yyy.com": 2 }
                if (!("timestamp" in elem)) {
                    return true;
                }
                times.push(elem["timestamp"]);
                delete elem["timestamp"]; // 删除timestamp属性

                for (var k in elem) {
                    if (_.indexOf(hosts, k) === -1) {
                        hosts.push(k);
                    }
                }
            });

            $(data).each(function (idx, elem) { // idx: 0,1,2... elem: { "24101": 5, "24303": 2 }
                if ($.isEmptyObject(elem)) {
                    return true;
                }
                $(hosts).each(function(i, host) {
                    var n = elem[host] || 0;
                    if (!(host in datas)) {
                        datas[host] = [];
                    }
                    datas[host].push(n);
                });
            });

            let series = [];
            $.each(datas, function (k, v) {
                series.push({
                    name: k,
                    type: "bar",
                    stack: '总量',
                    data: v
                });
            });
            let legend = _.map(_.keys(datas), function (i) {
                return i;
            });
            let dom = $(".vh-error-stat-error-host-oneday")[0];

            // 销毁上一个图型
            var instance = E.getInstanceByDom(dom);
            if (instance) {
                instance.dispose();
            }

            graph_bar2(dom, times, legend, series, codeName);
        }, null);
    });
}

/**
 *  柱状图 总览图
 */
function graph_bar(dom, axis, legend, series, doEvent) {
    var myChart = E.init(dom);

    var option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: legend,
            x: "right"
        },
        grid: [{
            left: '20',
            right: '40',
            bottom: '50',
            containLabel: true
        }],
        xAxis: [{
            type: 'category',
            boundaryGap: true,
            axisLine: {onZero: true},
            name: "时间",
            axisLabel: {
                rotate: -15
            },
            data: axis
        }],
        yAxis: [{
            name: '个数',
            type: 'value'
        }],
        series: series
    };

    myChart.setOption(option);

    doEvent && doEvent(myChart);
}

function graph_bar2(dom, axis, legend, series, title, doEvent) {
    var myChart = E.init(dom);

    var option = {
        backgroundColor: '#fffaf3',
        title: {
            text: title,
            x: 'left',
            top: '0',
            textStyle: {
                fontSize: 14
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: legend,
            top: '20',
            x: "right"
        },
        grid: [{
            left: '20',
            right: '40',
            bottom: '50',
            top: '80',
            containLabel: true
        }],
        xAxis: [{
            type: 'category',
            boundaryGap: true,
            axisLine: {onZero: true},
            name: "时间",
            axisLabel: {
                rotate: -15
            },
            data: axis
        }],
        yAxis: [{
            name: '个数',
            type: 'value'
        }],
        series: series
    };

    myChart.setOption(option);

    doEvent && doEvent(myChart);
}

/**
 *  饼图
 */
function monitor_error_oneday() {
    Tool.xhr_get(Constant.url.monitor_error_stat_oneday, function (data, textStatus, jqXHR) {
        $.each(data, function (k, v) { // k: 1, 2, 11, 12, ... v: {14002: 29, ...}
            var name = Tool.getModule(k), sum = 0;
            var legend = [], vals = [], series = [];
            $.each(v, function (i, j) { // i: 14002  j: 29
                var _s = i + " " + Tool.getMessage(i);
                legend.push(_s);
                vals.push({
                    value: j,
                    name: _s
                });
                sum += j;
            });

            series.push({
                name: name,
                type: 'pie',
                radius: '50%',
                center: ['50%', '75%'],
                data: vals,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            });

            $(".vh-error-stat-header-pie").html("一天数据");

            var dom = $('.vh-error-stat-modules-' + k)[0];
            if (dom) {
                var instance = E.getInstanceByDom(dom);
                if (instance) {
                    instance.dispose();
                }
                $(dom).prev("h5").html($(dom).prev("h5").html() + " (" + sum + ")"); // 统计各个总数
                graph_pie(dom, legend, series);
            }

        });

    });
}

/**
 * 饼状图
 * @param dom
 * @param legend
 * @param series
 */
function graph_pie(dom, legend, series) {
    var myChart = E.init(dom);

    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: legend
        },
        series: series
    };
    myChart.setOption(option);

    //monitor_error_modules_event(myChart);
}

// ---------------------------------------------------------------------------- //

function monitor_error_overview_bak2() {
    Tool.xhr_get(Constant.url.monitor_error_stat_overview, function (data, textStatus, jqXHR) {
        var times = [], // 时间轴
            host = [], // 主机名 也是legend
            series = [],
            dataArr = []; // 存放刻个时间段对应的数据 { "live-srscore02.vhouhn.com": { "24303": "44" }, ... }
        $.each(data, function(k, v) { // k: "2016073119"  v: { "live-srscore02.vhouhn.com": { "24303": "44" }, ... }
            var time = k.replace(/(\d{4})(\d{2})(\d{2})(\d{2})/, "$1/$2/$3 $4:00");
            times.push(time);

            $.each(v, function(x, y) { // x: "live-srscore02.vhouhn.com"   y: {"24303": "44", ...}
                if (_.indexOf(host, x) === -1) {
                    host.push(x); // 所有可能的主机
                }
            });

            dataArr.push(v);
        });

        var hostNumber = {};  // 各个主机按时间的错误数 {"xxx.vhall.com": [2, 0, 5, ...], ...}
        $(dataArr).each(function(idx, o) { // o: { "live-srscore02.vhouhn.com": { "24303": "44" }, ... }
            $(host).each(function (i, item) {
                if (!(item in hostNumber)) {
                    hostNumber[item] = [];
                }
                var obj = o[item]; // {"64001": "2", "64002": "178", ...}
                var num = (obj && _.reduce(obj, function(result, value, key) {
                        return parseInt(result, 10) + parseInt(value, 10);
                    }, 0)) || 0;
                hostNumber[item].push(num);
            });
        });

        $.each(host, function (i, o) {
            series.push({
                name: host[i],
                type: "bar",
                stack: '总量',
                data: hostNumber[o]
            });
        });

        var dom = $(".vh-error-stat-overview")[0];

        graph_bar(dom, times, host, series, null);

    }, null);
}

/**
 *  第一个柱状图 总览图 组织数据
 */
function monitor_error_overview_bak() {
    var _datas = {};
    Tool.xhr_get(Constant.url.monitor_error_stat_overview, function (data, textStatus, jqXHR) {
        $(data).each(function (idx, elem) {
            $.each(elem, function (k, v) { // k: "17:52:00" v: {"1": {"14001": 32}}
                errorStatData[k] = v; // 储存数据 用在饼图上
                $.each(v, function (x, y) { // x: "1" y: {"14001": 32}
                    var sum = _.reduce(_.values(y), function (memo, num) {
                        return memo + num;
                    }, 0);
                    if (!(x in _datas)) {
                        _datas[x] = [];
                    }
                    _datas[x].push(sum);
                });
            });
        });
        var series = [];
        $.each(_datas, function (k, v) {
            series.push({
                name: Tool.getModule(k),
                type: "bar",
                stack: '总量',
                data: v
            });
        });
        var legend = _.map(_.keys(_datas), function (i) {
            return Tool.getModule(i);
        });
        var dom = $(".vh-error-stat-overview")[0];
        var axis = _.keys(errorStatData);

        graph_bar(dom, axis, legend, series, null);
    }, null);

}

/**
 * 饼状图点击事件
 * @param myChart
 */
function monitor_error_modules_event(myChart) {
    myChart.on("click", function (params) {
        var module = params.seriesName; // module
        var name = params.name;
        var code = name.split(" ")[0]; // 要显示的错误代码
        var times = []; // 时间轴
        var data = []; // 只保留要显示的错误代码的数组 [{"09:10:50": {"xxx.vhall.com": 2, ...}}, ...]
        Tool.xhr_get(Constant.url.monitor_error_stat_host, function (_data, textStatus, jqXHR) {
            // 找出code在每个时间的数据 其余错误代码忽略
            // _data -> [{"09:10:50": {"14002": {"xxx.vhall.com": 2, ...}, ...}}, {...}, ...]
            $(_data).each(function (idx, elem) { // idx: 0, 1, 2 ...  elem: {"09:10:50": {"14002": {"xxx.vhall.com": 2, ...}, ...}}
                var key = _.keys(elem); // key: ["09:10:50"]
                var obj = elem[key[0]]; // obj: {"14002": {"xxx.vhall.com": 2, ...}, ...}
                //times.push(key[0]);
                var o = obj[code]; // o: {"xxx.vhall.com": 2, ...}
                if (o) {
                    var _o = {};
                    _o[key] = o;
                    data.push(_o);
                }
            });

            // 找出所有可能的主机
            var hosts = []; // 所有可能的主机

            // data -> [{"09:10:50": {"xxx.vhall.com": 2, ...}}, ...]
            $(data).each(function (idx, elem) { // idx: 0, 1, 2 ... elem: {"09:10:50": {"xxx.vhall.com": 2, ...}}
                var key = _.keys(elem)[0];
                times.push(key);
                $.each(elem[key], function (k, v) { // elem[key]: {"xxx.vhall.com": 2, ...}
                    if (_.indexOf(hosts, k) === -1) {
                        hosts.push(k);
                    }
                });
            });

            var hostNumber = {}; // 各个主机按时间的错误数 {"xxx.vhall.com": [2, 0, 5, ...], ...}

            $(data).each(function (idx, elem) { // idx: 0, 1, 2 ... elem: {"09:10:50": {"xxx.vhall.com": 2, ...}}
                var key = _.keys(elem)[0];
                var o = elem[key]; // o: {"xxx.vhall.com": 2, ...}
                $(hosts).each(function (i, item) {
                    if (!(item in hostNumber)) {
                        hostNumber[item] = [];
                    }
                    hostNumber[item].push(o[item] || 0);
                });
            });

            var legend = _.keys(hostNumber);
            var series = [];

            $.each(legend, function (i, o) {
                series.push({
                    name: legend[i],
                    type: "bar",
                    stack: '总量',
                    data: hostNumber[o]
                });
            });

            $(".vh-error-stat-header-col").html(code + ": " + Tool.getMessage(code));

            var dom = $(".vh-error-stat-host")[0];

            // 销毁上一个图型
            var instance = E.getInstanceByDom(dom);
            if (instance) {
                instance.dispose();
            }

            curModule = _.invert(Tool.getModules())[module]; // 当前的模块id
            curCode = code;
            //graph_bar(dom, times, legend, series, monitor_error_host_event);
            dom.scrollIntoView();
        }, null);
    });
}

/**
 * 第二个柱状图点击事件
 * @param myChart
 */
function monitor_error_host_event(myChart) {
    myChart.on("click", function (params) {
        var host = params.seriesName; // 主机名
        var time = params.name; // 时间 02:12:23

        var start = time.slice(0, 2); // 起始时间
        var end = parseInt(start) + 1; // 结束时间
        if (end === 24) {
            end = "00";
        }

        if (end < 10) {
            end = "0" + end;
        }

        var url = Constant.pages.log_search;
        var p = {
            host: host,
            module: curModule,
            code: curCode,
            start: start,
            end: end
        };
        url += "?" + $.param(p);

        $(".ui.modal.vh-modal-log_search")
            .modal({
                closable: false,
                onShow: function () {
                    $('.ui.embed').embed({
                        url: encodeURI(url)
                    });
                },
                onVisible: function () {
                    var ifr = $("iframe");
                    var doc = $(ifr[0].contentWindow.document);
                    if (doc.length) {
                        doc.find("html").css("overflow", "auto");
                        doc.find(".vh-main-header").remove();
                        doc.find(".vh-footer").remove();
                        doc.find("h2.ui.header.vh-table").remove();
                    }
                },
                onHide: function () {
                    $('.ui.embed').find(".embed").remove();
                }
            })
            .modal('setting', 'transition', "swing right")
            .modal('show').modal("refresh");
    });
}
