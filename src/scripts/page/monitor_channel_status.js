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

    channel_quality();
    channel_cdn();
    channel_error();
    channel_table();
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
        backgroundColor: '#404a59',
        color: [labelColor],
        title: [{
            text: '共有用户' + sum + "名",
            textStyle: {
                fontSize: 14,
                color: "#eee"
            }
        }],
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                return params.name + ' : ' + (params.value[2] || params.value) + "名";
            }
        },
        legend: {
            orient: 'vertical',
            y: 'bottom',
            x:'right',
            data:['用户数量'],
            textStyle: {
                color: '#eee'
            }
        },
        visualMap: {
            min: 0,
            max: max,
            calculable: true,
            text:['高', '低'],
            textStyle: {
                color: '#eee'
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
                    areaColor: '#323c48',
                    borderColor: '#999'
                },
                emphasis: {
                    areaColor: '#2a333d'
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

    if (data.length > 50) {
        option["series"].push({
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: data.sort(function (a, b) {
                return b["value"][2] - a["value"][2];
            }).slice(0, 5),
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
        }, {
            id: 'bar',
            zlevel: 2,
            type: 'bar',
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#ddb926'
                }
            },
            data: []
        });

        $.extend(option, {
            animation: true,
            animationDuration: 1000,
            animationEasing: 'cubicInOut',
            animationDurationUpdate: 1000,
            animationEasingUpdate: 'cubicInOut',
            toolbox: {
                iconStyle: {
                    normal: {
                        borderColor: '#fff'
                    },
                    emphasis: {
                        borderColor: '#b1e4ff'
                    }
                }
            },
            brush: {
                outOfBrush: {
                    color: '#abc'
                },
                brushStyle: {
                    borderWidth: 2,
                    color: 'rgba(0,0,0,0.2)',
                    borderColor: 'rgba(0,0,0,0.5)'
                },
                seriesIndex: [0, 1],
                throttleType: 'debounce',
                throttleDelay: 300,
                geoIndex: 0
            },
            grid: {
                right: 40,
                top: 200,
                bottom: 40,
                width: '25%'
            },
            xAxis: {
                type: 'value',
                scale: true,
                position: 'top',
                boundaryGap: false,
                minInterval: 1,
                splitLine: {show: false},
                axisLine: {show: false},
                axisTick: {show: false},
                axisLabel: {margin: 2, textStyle: {color: '#aaa'}}
            },
            yAxis: {
                type: 'category',
                nameGap: 16,
                axisLine: {show: false, lineStyle: {color: '#ddd'}},
                axisTick: {show: false, lineStyle: {color: '#ddd'}},
                axisLabel: {interval: 0, textStyle: {color: '#ddd'}},
                data: []
            }
        });

        option["title"].push({
            id: 'statistic',
            right: 120,
            top: 40,
            width: 100,
            textStyle: {
                color: '#eee',
                fontSize: 14
            }
        });

        myChart.on('brushselected', function(params) {
            _renderBrushed(this, params, data);
        });

        setTimeout(function () {
            myChart.dispatchAction({
                type: 'brush',
                areas: [
                    {
                        geoIndex: 0,
                        brushType: 'polygon',
                        coordRange: [[119.72,34.85],[119.68,34.85],[119.5,34.84],[119.19,34.77],[118.76,34.63],[118.6,34.6],
                            [118.46,34.6],[118.33,34.57],[118.05,34.56],[117.6,34.56],[117.41,34.56],[117.25,34.56],[117.11,34.56],
                            [117.02,34.56],[117,34.56],[116.94,34.56],[116.94,34.55],[116.9,34.5],[116.88,34.44],[116.88,34.37],
                            [116.88,34.33],[116.88,34.24],[116.92,34.15],[116.98,34.09],[117.05,34.06],[117.19,33.96],[117.29,33.9],
                            [117.43,33.8],[117.49,33.75],[117.54,33.68],[117.6,33.65],[117.62,33.61],[117.64,33.59],[117.68,33.58],
                            [117.7,33.52],[117.74,33.5],[117.74,33.46],[117.8,33.44],[117.82,33.41],[117.86,33.37],[117.9,33.3],
                            [117.9,33.28],[117.9,33.27],[118.09,32.97],[118.21,32.7],[118.29,32.56],[118.31,32.5],[118.35,32.46],
                            [118.35,32.42],[118.35,32.36],[118.35,32.34],[118.37,32.24],[118.37,32.14],[118.37,32.09],[118.44,32.05],
                            [118.46,32.01],[118.54,31.98],[118.6,31.93],[118.68,31.86],[118.72,31.8],[118.74,31.78],[118.76,31.74],
                            [118.78,31.7],[118.82,31.64],[118.82,31.62],[118.86,31.58],[118.86,31.55],[118.88,31.54],[118.88,31.52],
                            [118.9,31.51],[118.91,31.48],[118.93,31.43],[118.95,31.4],[118.97,31.39],[118.97,31.37],[118.97,31.34],
                            [118.97,31.27],[118.97,31.21],[118.97,31.17],[118.97,31.12],[118.97,31.02],[118.97,30.93],[118.97,30.87],
                            [118.97,30.85],[118.95,30.8],[118.95,30.77],[118.95,30.76],[118.93,30.7],[118.91,30.63],[118.91,30.61],
                            [118.91,30.6],[118.9,30.6],[118.88,30.54],[118.88,30.51],[118.86,30.51],[118.86,30.46],[118.72,30.18],
                            [118.68,30.1],[118.66,30.07],[118.62,29.91],[118.56,29.73],[118.52,29.63],[118.48,29.51],[118.44,29.42],
                            [118.44,29.32],[118.43,29.19],[118.43,29.14],[118.43,29.08],[118.44,29.05],[118.46,29.05],[118.6,28.95],
                            [118.64,28.94],[119.07,28.51],[119.25,28.41],[119.36,28.28],[119.46,28.19],[119.54,28.13],[119.66,28.03],
                            [119.78,28],[119.87,27.94],[120.03,27.86],[120.17,27.79],[120.23,27.76],[120.3,27.72],[120.42,27.66],
                            [120.52,27.64],[120.58,27.63],[120.64,27.63],[120.77,27.63],[120.89,27.61],[120.97,27.6],[121.07,27.59],
                            [121.15,27.59],[121.28,27.59],[121.38,27.61],[121.56,27.73],[121.73,27.89],[122.03,28.2],[122.3,28.5],
                            [122.46,28.72],[122.5,28.77],[122.54,28.82],[122.56,28.82],[122.58,28.85],[122.6,28.86],[122.61,28.91],
                            [122.71,29.02],[122.73,29.08],[122.93,29.44],[122.99,29.54],[123.03,29.66],[123.05,29.73],[123.16,29.92],
                            [123.24,30.02],[123.28,30.13],[123.32,30.29],[123.36,30.36],[123.36,30.55],[123.36,30.74],[123.36,31.05],
                            [123.36,31.14],[123.36,31.26],[123.38,31.42],[123.46,31.74],[123.48,31.83],[123.48,31.95],[123.46,32.09],
                            [123.34,32.25],[123.22,32.39],[123.12,32.46],[123.07,32.48],[123.05,32.49],[122.97,32.53],[122.91,32.59],
                            [122.83,32.81],[122.77,32.87],[122.71,32.9],[122.56,32.97],[122.38,33.05],[122.3,33.12],[122.26,33.15],
                            [122.22,33.21],[122.22,33.3],[122.22,33.39],[122.18,33.44],[122.07,33.56],[121.99,33.69],[121.89,33.78],
                            [121.69,34.02],[121.66,34.05],[121.64,34.08]]
                    }
                ]
            });
        }, 0);
    }

    myChart.setOption(option);
}

function _renderBrushed(that, params, data) {
    var mainSeries = params.batch[0].selected[0];

    var selectedItems = [];
    var categoryData = [];
    var barData = [];
    var maxBar = 30;
    var sum = 0;
    var count = 0;

    for (let i = 0; i < mainSeries.dataIndex.length; i++) {
        var rawIndex = mainSeries.dataIndex[i];
        var dataItem = data[rawIndex];
        sum += dataItem.value[2];
        count++;
        selectedItems.push(dataItem);
    }

    selectedItems.sort(function (a, b) {
        return a.value[2] - b.value[2];
    });

    for (let i = 0; i < Math.min(selectedItems.length, maxBar); i++) {
        categoryData.push(selectedItems[i].name);
        barData.push(selectedItems[i].value[2]);
    }

    that.setOption({
        yAxis: {
            data: categoryData
        },
        xAxis: {
            axisLabel: {show: !!count}
        },
        title: {
            top: 150,
            right: "12.5%",
            id: 'statistic',
            text: count ? '平均: ' + (sum / count).toFixed(0) + "名用户" : '',
            testStyle: {
                fontSize: 12
            }
        },
        series: {
            id: 'bar',
            data: barData
        }
    });
}
