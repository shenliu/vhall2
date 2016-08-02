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

    channel_error();
    channel_table();
});

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
                    datas[x].push(y);
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
    var arr = [];
    $(data).each(function(idx, obj) { // idx: 0,1,2... obj: {"122004": {...}}
        var o = {};
        var key = _.keys(obj)[0];
        var val = obj[key];
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
            name: "时间",
            axisLabel: {
                rotate: -15
            },
            data: axis
        }],
        yAxis: [{
            name: '个数',
            minInterval: 1,
            type: 'value'
        }],
        series: series
    };

    myChart.setOption(option);
}
