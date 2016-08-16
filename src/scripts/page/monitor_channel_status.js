/**
 * Created by shen on 2016/7/28.
 */

"use strict";

require("semantic/semantic.min.css");
require("../../css/lib/jquery.dataTables.min.css");
require("../../css/common/common.less");
require("../../css/page/monitor.less");
require("../../css/page/channel_status.less");

import * as _ from 'lodash';

let E = require("echarts/dist/echarts.min");

//require("../lib/china");

import {Constant} from './constant';

import {Tool} from './tool';

let streamID;
let table;
let tpl;

$(function () {
    streamID = Tool.urlParam("id", location.search.slice(1));
    if (!streamID) {
        return;
    }
    $("#vh-streamID").find("i").html(streamID);
    Tool.xhr_get("./data/china.json", function (data, textStatus, jqXHR) {
        E.registerMap('china', data);
        channel_user_map();
    }, null);

    //channel_quality();
    //channel_cdn();
    //channel_error();
    //channel_table();
});

// 用户地图
function channel_user_map() {
    let datas = [];
    let max = 0,
        sum = 0;

    let url = Constant.url.monitor_channel_map.replace("{id}", streamID);
    Tool.xhr_get(url, function (data, textStatus, jqXHR) {
        $(data).each(function(key, val) { // key: 0,1,2  val: {"city_name": "上海", "latitude": 31.0456,"longitude": 121.3997, "user": 8}
            if (!val["city_name"]) { // 可能为null
                return true;
            }
            datas.push({
                name: val["city_name"],
                value: [
                    val["longitude"],
                    val["latitude"],
                    val["user"]
                ]
            });

            if (max < val["user"]) {
                max = val["user"];
            }
            sum += val["user"];
        });
        let dom = $("#vh-channel-user-map")[0];
        _graph_map(dom, sum, max, datas);
    }, null);
}

// 发起观看质量分时图
function channel_quality() {
    let times = []; // x轴 时间
    let datas = {}; // 数据

    let url = Constant.url.monitor_channel_quality.replace("{id}", streamID);
    Tool.xhr_get(url, function (data, textStatus, jqXHR) {
        $(data).each(function (idx, elem) { // idx: 0,1,2... elem: {"74001": 495, ...}
            if (!("timestamp" in elem)) {
                return true;
            }
            times.push(elem["timestamp"]);
            $.each(elem, function (x, y) { // x: "74001" y: 495
                if (x !== "timestamp") {
                    if (!(x in datas)) {
                        datas[x] = [];
                    }
                    datas[x].push(y || 0);
                }
            });
        });
        let series = [];
        $.each(datas, function (k, v) {
            series.push({
                name: Tool.getMessage(k),
                type: "line",
                //stack: '总量',
                data: v
            });
        });
        let legend = _.map(_.keys(datas), function (i) {
            return Tool.getMessage(i);
        });
        let dom = $("#vh-channel-quality")[0];

        _graph_bar(dom, times, legend, series);
    }, null);
}

// CDN质量分时图
function channel_cdn() {
    let times = []; // x轴 时间
    let datas = {}; // 数据
    let cdns = []; // legend cdn名称

    let url = Constant.url.monitor_channel_cdn.replace("{id}", streamID);
    Tool.xhr_get(url, function (data, textStatus, jqXHR) {
        // 去除数组空{}项
        data = data.filter((item) => !$.isEmptyObject(item));

        $(data).each(function (idx, elem) { // idx: 0,1,2... elem: {"cnrtmplive02.e.vhall.com": {"bad": 2, "good": 0}, ... }
            if (!("timestamp" in elem)) {
                return true;
            }
            times.push(elem["timestamp"]);
            delete elem["timestamp"]; // 删除timestamp属性

            for (var k in elem) {
                if (_.indexOf(cdns, k) === -1) {
                    cdns.push(k);
                }
            }
        });

        $(data).each(function (idx, elem) { // idx: 0,1,2... elem: {"cnrtmplive02.e.vhall.com": {"bad": 2, "good": 0}, ... }
            $(cdns).each(function(i, cdn) {
                var o = elem[cdn];
                var n;
                if (o) { // 有这个cdn
                    n = parseFloat(((o["bad"] / (o["bad"] + o["good"])) * 100).toFixed(2));
                }
                if (!(cdn in datas)) {
                    datas[cdn] = [];
                }
                datas[cdn].push(n || 0);
            });
        });

        let series = [];
        $.each(datas, function (k, v) {
            series.push({
                name: k,
                type: "line",
                //stack: '总量',
                data: v
            });
        });

        let dom = $("#vh-channel-cdn")[0];

        _graph_line(dom, times, cdns, series);
    }, null);
}

// 错误分时图
function channel_error() {
    let times = []; // x轴 时间
    let datas = {}; // 数据

    let url = Constant.url.monitor_channel_error.replace("{id}", streamID);
    Tool.xhr_get(url, function (data, textStatus, jqXHR) {
        $(data).each(function (idx, elem) { // idx: 0,1,2... elem: {"1": 12, "2": null, ...}
            if (!("timestamp" in elem)) {
                return true;
            }
            times.push(elem["timestamp"]);
            $.each(elem, function (x, y) { // x: "1" y: 12
                if (x !== "timestamp") {
                    if (!(x in datas)) {
                        datas[x] = [];
                    }
                    datas[x].push(y || 0);
                }
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
        let dom = $("#vh-channel-error")[0];

        _graph_bar(dom, times, legend, series);
    }, null);
}

function channel_table() {
    tpl = _.template($("#tpl_td_list").html());
    var $table = $("table.ui.table");
    table = $table.DataTable({
        "dom": 'if<t>lp',
        "language": Constant.tableLocale
        ,"autoWidth": false
        ,"scrollX": true
        ,"lengthMenu": [[-1, 25, 50, 75, 100], ['全部', 25, 50, 75, 100]]
        ,"ajax": {
            "url": Constant.url.monitor_channel_mod_history.replace("{id}", streamID),
            "dataSrc": function (json) {
                // 清除数据源中无用的 即没有"timestamp"的
                var data = [];
                $(json).each(function(idx, obj) {
                    if ("timestamp" in obj) {
                        data.push(obj);
                    }
                });
                return data;
            }
        }
        ,"order": [[ 0, "asc" ]]
        ,"columns": [{
            // 时间 idx: 0
            data: "timestamp"
        },{
            // 第三方 idx: 1
            data: "20",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["20"], "20");
                } else
                    return "-";
            }
        }, {
            // 直播助手 idx: 2
            data: "1",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["1"], "1");
                } else
                    return "-";
            }
        }, {
            // 移动发起 idx: 3
            data: "5",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["5"], "5");
                } else
                    return "-";
            }
        }, {
            // SRS接收 idx: 4
            data: "2",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["2"], "2");
                } else
                    return "-";
            }
        }, {
            // SRS分发 idx: 5
            data: "11",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["11"], "11");
                } else
                    return "-";
            }
        } , {
            // 多码流转码 idx: 6
            data: "16",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["16"], "16");
                } else
                    return "-";
            }
        }, {
            // HLS切片 idx: 7
            data: "12",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["12"], "12");
                } else
                    return "-";
            }
        }, {
            // HLS同步 idx: 8
            data: "13",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["13"], "13");
                } else
                    return "-";
            }
        }, {
            // HLS回放 idx: 9
            data: "14",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["14"], "14");
                } else
                    return "-";
            }
        }, {
            // 文档转换 idx: 10
            data: "23",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["23"], "23");
                } else
                    return "-";
            }
        }, {
            // 截图 idx: 11
            data: "15",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["15"], "15");
                } else
                    return "-";
            }
        }]
    });

    // 表格事件
    table.on('draw', function (e) {
        channel_table_event();
    }).on('init', function() {

    });
}

function channel_table_event() {

}


// ----------------------------------------------------------- //

/**
 * 生成模版(id="tpl_td_list")
 * @param data  {Array}    每一个单元格td的数据 如: 直播助手
 * @param k  {String}       模块编号
 * @returns {string}  返回生成的模版
 * @private
 */
function _genList(data, k) {
    let arr = [];
    $(data).each(function(idx, obj) { // idx: 0,1,2... obj: {"122004": {...}}
        let o = {};
        let key = _.keys(obj)[0];
        let val = obj[key];
        o["bg"] = Constant.level[val["type"]];
        o["code"] = key;
        o["desc"] = Tool.getMessage(key);
        o["date"] = val["timestamp"];
        o["num"] = val["NO"];
        arr.push(o);
    });

    return tpl({
        items: arr,
        id: streamID,
        k: k
    });
}

function _graph_bar(dom, axis, legend, series) {
    let myChart = E.init(dom);

    let option = {
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
}

function _graph_line(dom, axis, legend, series) {
    var myChart = E.init(dom);

    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type : 'shadow'
            }
        },
        legend: {
            data: legend,
            x: 'right'
        },
        grid: [{
            left: '20',
            right: '40',
            bottom: '50',
            containLabel: true
        }],
        xAxis: [{
            type : 'category',
            boundaryGap : true,
            axisLine: {onZero: true},
            name: "时间",
            axisLabel: {
                rotate: -15
            },
            data: axis
        }],
        yAxis: [{
            name : '百分比',
            //max: 110,
            type : 'value'
        }],
        series: series
    };

    myChart.setOption(option);
}

function _graph_map(dom, sum, max, data) {
    let myChart = E.init(dom);
    let labelColor = "#b71419";

    let option = {
        backgroundColor: '#fffaf3',
        color: [labelColor],
        title: {
            text: '共有用户' + sum + "名",
            textStyle: {
                fontSize: 14
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                return params.name + ' : ' + params.value[2] + "名";
            }
        },
        legend: {
            orient: 'vertical',
            y: 'bottom',
            x:'right',
            data:['用户数量'],
            textStyle: {
                color: '#333'
            }
        },
        visualMap: {
            min: 0,
            max: max,
            calculable: true,
            text:['高', '低'],
            textStyle: {
                color: '#333'
            }
        },
        geo: {
            map: 'china',
            roam: true,
            label: {
                normal: {
                    show: false,
                    textStyle: {
                        color: "#aaa"
                    }
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        color: "#eee"
                    }
                }
            },
            itemStyle: {
                normal: {
                    areaColor: '#b7c29a',
                    borderColor: '#999'
                },
                emphasis: {
                    areaColor: '#5d7539'
                }
            }
        },
        series: [{
            name: '用户数量',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: data,
            symbolSize: function (val) {
                return Math.max(Math.min(val[2] / 10, 16), 4); // 5 - 14
            },
            //symbol: "pin",
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            itemStyle: {
                emphasis: {
                    borderColor: '#666',
                    borderWidth: 1
                }
            }
        }]
    };

    if (data.length > 100) {
        option["series"].push({
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: data.sort(function (a, b) {
                return b["value"][2] - a["value"][2];
            }).slice(0, 6),
            symbolSize: function (val) {
                return Math.max(Math.min(val[2] / 10, 16), 4);
            },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: '#f4e925',
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            zlevel: 1
        });
    }

    myChart.setOption(option);
}
