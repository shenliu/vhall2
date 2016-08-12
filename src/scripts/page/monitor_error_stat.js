"use strict";

require("semantic/semantic.min.css");
require("../../css/common/common.less");
require("../../css/page/monitor.less");
require("../../css/page/error_stat.less");

import * as _ from 'lodash';

var E = require("echarts/dist/echarts.min");

import {Constant} from './constant';

import {Tool} from './tool';

// init
$(function () {
    overview();
    one_hour();
    pie_oneday();
    Tool.dropdown();
});

// 第一个柱状图
function overview() {
    var url = Constant.url.monitor_error_stat_overview;
    _monitor_error(url, Tool.getModule, {cur: ".vh-error-stat-overview"});
}

// 第二个柱状图
function one_hour() {
    var url = Constant.url.monitor_error_stat_one_hour;
    _monitor_error(url, Tool.getModule, {cur: ".vh-error-stat-error-one-hour"}, null, null, {
        callback: _event_one_hour,
        params: null
    });
}

/**
 * 点击第二个柱状图 事件 - 出现第三个柱状图
 * @param myChart
 * @param params
 * @private
 */
function _event_one_hour(myChart, params) {
    myChart.on("click", function (arg) {
        var seriesName = arg.seriesName;
        var mod = Tool.getKey(Tool.getModules(), seriesName);
        if (!mod) {
            return;
        }

        let url = Constant.url.monitor_error_stat_error_mod.replace("{mod}", mod);
        _monitor_error(url, Tool.getFullMessage, {
            cur: ".vh-error-stat-error-mod",
            another: ".vh-error-stat-error-code" // 销毁第四个
        }, seriesName, {backgroundColor: '#fffaf3'}, {
            callback: _event_mod,
            params: null
        });

    });
}

/**
 * 点击第三个柱状图 事件 - 出现第四个柱状图
 * @param myChart
 * @param params
 */
function _event_mod(myChart, params) {
    myChart.on("click", function (arg) {
        var codeName = arg.seriesName;
        let url = Constant.url.monitor_error_stat_error_host.replace("{code}", codeName.split(" ")[0]);

        _monitor_error(url, null, {
            cur: ".vh-error-stat-error-code"
        }, codeName, {backgroundColor: '#fffaf3'});
    });
}

/**
 *  饼图
 */
function pie_oneday() {
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

            var dom = $('.vh-error-stat-modules-' + k)[0];
            if (dom) {
                var instance = E.getInstanceByDom(dom);
                if (instance) {
                    instance.dispose();
                }
                $(dom).prev("h5").html($(dom).prev("h5").html() + " (" + sum + ")"); // 统计各个总数
                graph_pie_oneday(dom, legend, series);
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
function graph_pie_oneday(dom, legend, series) {
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

// --------------------------------- //

/**
 * 生成柱状图数据
 * @param url
 * @param _T        Tool.getModule or Tool.getMessage
 * @param domClass  dom class {cur: 当前目标, another: 销毁的目标(可选)}
 * @param title     图型title
 * @param graph     对象 {backgroundColor: "", ...}
 * @param callbackObj  如有点击事件 {callback:事件的回调函数, params: {url:, ....(其他参数)} }
 * @private
 */
function _monitor_error(url, _T, domClass, title, graph, callbackObj) {
    let times = []; // x轴 时间
    let datas = {}; // 数据
    let arrs = []; // 模块或错误代码或主机名
    let series = [];

    Tool.xhr_get(url, function (data, textStatus, jqXHR) {
        // idx: 0,1,2... elem: {"2": { "24101": 5, "24303": 2 }, ...} 或 elem: { "24101": 5, "24303": 2 }
        $(data).each(function (idx, elem) {
            if (!("timestamp" in elem)) {
                return true;
            }
            times.push(elem["timestamp"]);
            delete elem["timestamp"]; // 删除timestamp属性

            for (var k in elem) {
                if (_.indexOf(arrs, k) === -1) {
                    arrs.push(k);
                }
            }
        });

        // idx: 0,1,2... elem: {"2": { "24101": 5, "24303": 2 }, ...} 或 elem: { "24101": 5, "24303": 2 }
        $(data).each(function (idx, elem) {
            if ($.isEmptyObject(elem)) {
                return true;
            }
            $(arrs).each(function(i, arr) {
                let o = elem[arr];
                if (!(arr in datas)) {
                    datas[arr] = [];
                }
                let num;
                if (typeof o === "object") { // elem: {"2": { "24101": 5, "24303": 2 }, ...}
                    num = (o && _.reduce(o, function(result, value, key) {
                        return parseInt(result, 10) + parseInt(value, 10);
                    }, 0)) || 0;
                } else { // elem: { "24101": 5, "24303": 2 }
                    num = elem[arr] || 0;
                }
                datas[arr].push(num);
            });
        });

        $.each(datas, function (k, v) {
            series.push({
                name: _T ? _T(k) : k,
                type: "bar",
                stack: '总量',
                data: v
            });
        });
        let legend = _.map(_.keys(datas), function (i) {
            return _T ? _T(i) : i;
        });
        let dom = $(domClass.cur);

        title && dom.parent("div").prev("h3").html(title);

        // 销毁上一个图型
        var instance = E.getInstanceByDom(dom[0]);
        if (instance) {
            instance.dispose();
            if (domClass.another) {
                var _dom = $(domClass.another);
                instance = E.getInstanceByDom(_dom[0]);
                instance && instance.dispose();
                _dom.parent("div").prev("h3").html("");
            }
        }

        _graph(dom[0], times, legend, series, graph, callbackObj);
    }, null);
}

function _graph(dom, axis, legend, series, graph, callbackObj) {
    var myChart = E.init(dom);

    var option = {
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

    graph && $.extend(option, graph);

    myChart.setOption(option);

    callbackObj && callbackObj.callback(myChart, callbackObj.params);
}
