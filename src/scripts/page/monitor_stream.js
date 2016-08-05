/**
* Created by shen on 2016/7/18.
*/

"use strict";

require("semantic/semantic.min.css");
require("../../css/lib/jquery.dataTables.min.css");
require("../../css/common/common.less");
require("../../css/page/monitor.less");

import * as _ from 'lodash';

var E = require("echarts/dist/echarts.min");

import {Constant} from './constant';

import {Tool} from './tool';

// init
$(function() {
    _table_order();
    monitor_table();
    monitor_table_event();
    Tool.dropdown();
});

let templateCollect = _.template($("#tpl_td_collect").html());
let template = _.template($("#tpl_td_list").html());
let table;

function monitor_table() {
    var reloadInterval, countDownInterval;

    var $table = $("table.ui.table");
    table = $table.DataTable({
        "dom": 'if<"vh-table-toolbar">tlp',
        "language": Constant.tableLocale
        ,"autoWidth": false
        ,"scrollX": true
        ,"lengthMenu": [[25, 50, 75, 100, -1], [25, 50, 75, 100, '全部']]
        ,"ajax": {
            "url": Constant.url.monitor_stream,
            "dataSrc": function (json) {
                var data = [];
                $.each(json, function (k, v) {
                    var o = v;
                    o["streamid"] = k;
                    data.push(o);
                });
                return data;
            }
        }
        ,"order": [[ 16, "desc" ]]
        ,"columns": [{
            // 流ID idx: 0
            data: "streamid",
            render: function(data, type, row, meta) {
                if (data) {
                    var id = data.substring(0, 32);
                    var html = ["<a href='monitor_channel_status.html?id=", id, "' target='_blank'>", id, "</a>"];
                    return html.join("");
                } else
                    return "-";
            }
        }, {
            // 流信息 idx: 1  todo
            data: "15",
            render: function(data, type, row, meta) {
                if (data) {
                    var url = data["image_url"];
                    var html = ["<img src='' data-src='", url, "' width='180' height='100' />"];
                    return html.join("");
                } else
                    return "-";
            }
        }, {
            // 第三方 idx: 2
            data: "20",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["20"], row["streamid"], "20");
                } else
                    return "-";
            }
        }, {
            // 直播助手 idx: 3
            orderDataType: "dom-error-number",
            type: "numeric",
            data: "1",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["1"], row["streamid"], "1");
                } else
                    return "-";
            }
        }, {
            // 移动发起 idx: 4
            orderDataType: "dom-error-number",
            type: "numeric",
            data: "5",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["5"], row["streamid"], "5");
                } else
                    return "-";
            }
        }, {
            // SRS接收 idx: 5
            orderDataType: "dom-error-number",
            type: "numeric",
            data: "2",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["2"], row["streamid"], "2");
                } else
                    return "-";
            }
        }, {
            // SRS分发 idx: 6
            orderDataType: "dom-error-number",
            type: "numeric",
            data: "11",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["11"], row["streamid"], "11");
                } else
                    return "-";
            }
        } , {
            // 多码流转码 idx: 7
            orderDataType: "dom-error-number",
            type: "numeric",
            data: "16",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["16"], row["streamid"], "16");
                } else
                    return "-";
            }
        }, {
            // HLS切片 idx: 8
            orderDataType: "dom-error-number",
            type: "numeric",
            data: "12",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["12"], row["streamid"], "12");
                } else
                    return "-";
            }
        }, {
            // HLS同步 idx: 9
            orderDataType: "dom-error-number",
            type: "numeric",
            data: "13",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["13"], row["streamid"], "13");
                } else
                    return "-";
            }
        }, {
            // HLS回放 idx: 10
            orderDataType: "dom-error-number",
            type: "numeric",
            data: "14",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["14"], row["streamid"], "14");
                } else
                    return "-";
            }
        }, {
            // 移动 idx: 11
            orderDataType: "dom-collect-number",
            type: "numeric",
            data: "6",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["6"], row["streamid"], "6");
                } else
                    return "-";
            }
        }, {
            // 移动用户 idx: 12
            orderDataType: "dom-collect-number",
            type: "numeric",
            data: "user.cdn.6",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genCollect(row, "mobile_cdn", "6");
                } else
                    return "-";
            }
        }, {
            // Flash idx: 13
            orderDataType: "dom-collect-number",
            type: "numeric",
            data: "7",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["7"], row["streamid"], "7");
                } else
                    return "-";
            }
        }, {
            // Flash用户 idx: 14
            orderDataType: "dom-collect-number",
            type: "numeric",
            data: "user.cdn.7",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genCollect(row, "flash_cdn", "7");
                } else
                    return "-";
            }
        }, {
            // 卡顿用户数 idx: 15
            orderDataType: "dom-user-number",
            type: "numeric",
            data: "user.baduser",
            render: function(data, type, row, meta) {
                var dom = ["<a class='vh-summery-count-each vh-block' data-id='", row["streamid"], "' href='###'>", data, "</a>"];
                return dom.join("");
            }
        }, {
            // 用户总数 idx: 16
            orderDataType: "dom-user-number",
            type: "numeric",
            data: "user.alluser",
            render: function(data, type, row, meta) {
                var dom = ["<a class='vh-summery-count-each vh-block' data-id='", row["streamid"], "' href='###'>", data, "</a>"];
                return dom.join("");
            }
        }]
    });

    // 表格事件
    table.on('draw', function (e) {
        //monitor_table_event_list_details();
        monitor_table_event_show_stream();
        _genImg();
    }).on('init', function() {
        var tpl = _.template($("#tpl_table_toolbar").html());
        var toolbar = $(".vh-table-toolbar").eq(0);
        toolbar.html(tpl({
            reload: Constant.reloadInterval / 1000
        }));

        // 筛选按钮
        toolbar.find(".ui.button.vh-tb-filter").on("click", function() {
            _filter(table, false);
        });

        $('.ui.dropdown').dropdown();

        // 倒计时
        var countdown = toolbar.find(".vh-auto-reload-countdown");

        // 自动刷新
        toolbar.find(".ui.checkbox").checkbox({
            onChecked: function() {
                reloadInterval = setInterval(function() {
                    table.ajax.reload();
                }, Constant.reloadInterval);

                countDownInterval = setInterval(function() {
                    var n = countdown.html() - 1;
                    if (n === 0) {
                        n = Constant.reloadInterval / 1000;
                    }
                    countdown.html(n);
                }, 1000);
            },
            onUnchecked: function() {
                clearInterval(reloadInterval);
                reloadInterval = undefined;

                clearInterval(countDownInterval);
                countDownInterval = undefined;
                countdown.html(Constant.reloadInterval / 1000);
            }
        });

        // 手动刷新
        toolbar.find(".vh-tb-reload").on("click", function() {
            table.ajax.reload();
        });

        // 快捷筛选
        toolbar.find(".ui.idea").popup({
            position: "bottom right",
            offset: 5,
            hoverable: true
        });

        toolbar.find(".vh-tb-shortcut").on("click", "a", function(e) {
            var target = $(e.currentTarget);
            var id = target.attr("data-id");
            switch(id) {
                case "1": // 过滤结束流
                    table.column(11).order("desc"); // 按<移动>列降序排列
                    _setFilter(5, "text", 5, "结束");
                    _filter(table, true); // 组合查询
                    break;
                case "2": // 流ID大于10的
                    _setFilter("0", "length", 3, 10);
                    _filter(table, true); // 组合查询
                    break;
                default:
                    break;
            }
        });

        // 取消筛选
        toolbar.find("button.vh-tb-filter-cancel").on("click", function() {
            $.fn.dataTable.ext.search.length = 0;
            _resetFilter();
            table.draw();
        });

    });
}

function monitor_table_event() {
    // 历史 操作 点击事件
    $(document).on("click", ".link.icon.vh-tb-list-oper", function() {
        var that = $(this);
        var code = that.attr("data-code"),
            id = that.attr("data-id"),
            host = that.attr("data-host"),
            k = that.attr("data-k");
        var template;
        var grid = that.parents(".ui.grid");
        if (that.hasClass("history")) { // 历史
            var url = Constant.url.monitor_stream_query_list_history.replace("{id}", id).replace("{host}", host).replace("{code}", code);
            Tool.xhr_get(url, function(data, textStatus, jqXHR) {
                var axis = [], all = [], host = [], stream = [];
                $.each(data, function(k, v) {
                    axis.push(k);
                    all.push(v["all"]);
                    host.push(v["host"]);
                    stream.push(v["stream"]);
                });

                template = _.template($("#tpl_modal_history").html());
                var html = template({
                    errorCode: code,
                    num: axis.length
                });
                grid.find(".vh-error-list-oper-box").html(html);
                var graph = grid.find(".vh-history-graph");
                monitor_table_graph(graph[0], axis, all, host, stream);
            }, null);
        } else { // 操作
            template = _.template($("#tpl_modal_oper").html());
            var html = template({
                errorCode: code,
                needHandle: code,
                reason: code,
                method: code
            });
            grid.find(".vh-error-list-oper-box").html(html);
        }
        grid.find(".item").removeClass("current-bg");
        that.parents(".item").eq(1).addClass("current-bg"); // 上边第二个 eq(1)
    });
}

/**
 *  点击每个绿红td 弹出对话框
 */
function monitor_table_event_list_details() {
    var td = $("table.ui.table").find(".vh-error-list");
    var template = _.template($("#tpl_modal_list").html());

    td.off("click").on("click", function(e) {
        var that = $(e.currentTarget);
        var selector = ".vh-modal-list-details";

        $(selector + ".ui.modal")
            .modal({
                closable: true,
                onShow: function() {
                    var id = that.attr("data-id");
                    var k = that.attr("data-k");
                    var n = Constant.queryNumber + "";
                    if (id) {
                        var url = Constant.url.monitor_channel_query_list.replace("{id}", id).replace("{k}", k).replace("{len}", n);
                        Tool.xhr_get(url, function(data, textStatus, jqXHR) {
                            console.log(data);
                            $.each(data["log_list"], function(idx, obj) {
                                // parse base64
                                //if ("_m" in obj["attr"]) {
                                    //obj["attr"]["_m"] = T.base64.decode(obj["attr"]["_m"]);
                                //}

                                data[idx]["desc"] = Tool.getMessage(obj.code); // 记录描述文字
                                data[idx]["date"] = Tool.dateFormat(new Date(obj.timestamp * 1000), "yyyy-MM-dd hh:mm:ss.S"); // 记录格式化时间
                                data[idx]["level"] = obj.type; // 记录level
                                data[idx]["bg"] = Constant.level[obj.type]; // 记录bg
                            });

                            $(selector).find(".vh-error-list-box").html(template({
                                items: data,
                                id: id,
                                k: k
                            }));

                            $(selector).find(".vh-error-list-oper-box").empty();

                            $(selector).find(".ui.checkbox").checkbox({
                                onChecked: function() {
                                    $(selector).find(".vh-error-list-box").find(".success").parents(".item").hide();
                                    $(selector).find(".vh-should-view")[0].scrollIntoView();
                                },
                                onUnchecked: function() {
                                    $(selector).find(".vh-error-list-box").find(".success").parents(".item").show();
                                    $(selector).find(".vh-should-view")[0].scrollIntoView();
                                }
                            });

                            // 隐藏 显示后 选择的显示在屏幕中
                            $(selector).find(".vh-error-list-box").on("click", ".item", function(e) {
                                var items = $(selector).find(".vh-error-list-box").find(".item");
                                items.removeClass("vh-should-view");

                                $(e.currentTarget).addClass("vh-should-view");
                            });
                        }, null);
                    } else {
                        return false; // 没有streamID 不显示列表
                    }
                }
            })
            .modal('setting', 'transition', "browse")
            .modal('show').modal("refresh");
    });

}

/**
 *  点击每个灰色的td中的list 弹出视频窗口
 */
function monitor_table_event_show_stream() {
    // more...
    $('.ui.accordion').accordion({
        selector: {
            trigger: '.title.vh-more'
        }
    });

    var td = $("table.ui.table").find(".vh-error-collect");

    // 弹出视频窗口
    td.off("click").on("click", ".item", function(e) {
        var that = $(e.currentTarget);
        var _td = that.parents(".vh-error-collect");
        var id = _td.attr("data-id");
        var k = _td.attr("data-k");
        var type = _td.attr("data-type");

        var domain = that.text().split(":")[0].trim();
        Tool.playStream(domain, id);
    });

    // 双击图片播放
    $(table.column(1).nodes()).on("dblclick", function(e) {
        var td = $(e.currentTarget);
        var tr = td.parent("tr");
        td = tr.find("td").eq(12);
        td.find(".item").trigger("click");
    });

    return;

    // 汇总
    $("table.ui.table td").off("click").on("click", ".vh-summery-count-each", function(e) {
        var that = $(e.currentTarget);
        var _td = that.parents(".vh-error-collect");
        if (_td.length === 0) {
            _td = that;
        }
        var id = _td.attr("data-id");
        var type = _td.attr("data-type") || "total"; // flash h5 ...

        $(".ui.modal.vh-modal-summery-count")
            .modal({
                closable: true,
                onShow: function() {
                    var url = Constant.url.monitor_stream_summery_count.replace("{id}", id);
                    Tool.xhr_get(url, function(data, textStatus, jqXHR) {
                        var times = [], legend = [], series = [], series_quality = [];
                        var app = [], flash = [], h5 = [],
                            app_quality = [], flash_quality = [], h5_quality = [],
                            each = {}, each_bad = {}, each_quality = {}, // 当不是全部时 存储各个分流的数据 如 "cnrtmplive02.e.vhall.com": 2
                            sum = 0, sum_bad;

                        var mobile_cdn = [],
                            flash_cdn = [],
                            h5_cdn = [];

                        // 取得所有分类的名称
                        $.each(data, function(k, v) {
                            var key = _.keys(v)[0]; // 时间
                            var cur = v[key]["alluser"];

                            $.each(cur["mobile_cdn"], function(i, j) {
                                if (_.indexOf(mobile_cdn, i) === -1) {
                                    mobile_cdn.push(i);
                                }
                            });

                            $.each(cur["flash_cdn"], function(i, j) {
                                if (_.indexOf(flash_cdn, i) === -1) {
                                    flash_cdn.push(i);
                                }
                            });

                            $.each(cur["h5_cdn"], function(i, j) {
                                if (_.indexOf(h5_cdn, i) === -1) {
                                    h5_cdn.push(i);
                                }
                            });
                        });

                        $.each(data, function(k, v) {
                            var key = _.keys(v)[0]; // 时间
                            times.push(key);

                            var cur = v[key]; // 当前对象 如 "14:15:16": {"alluser":{}, "baduser":{}}
                            var alluser = cur["alluser"];
                            var baduser = cur["baduser"];

                            if (type === "total") {
                                sum = 0;
                                sum_bad = 0;
                                $.each(alluser["mobile_cdn"], function(i, j) {
                                    sum += j;
                                });
                                app.push(sum);

                                $.each(baduser["mobile_cdn"], function(i, j) {
                                    sum_bad += j;
                                });
                                app_quality.push(_formula(sum, sum_bad));

                                sum = 0;
                                sum_bad = 0;
                                $.each(alluser["flash_cdn"], function(i, j) {
                                    sum += j;
                                });
                                flash.push(sum);

                                $.each(baduser["flash_cdn"], function(i, j) {
                                    sum_bad += j;
                                });
                                flash_quality.push(_formula(sum, sum_bad));

                                sum = 0;
                                sum_bad = 0;
                                // h5 暂时没有数据
                                h5.push(0);
                                h5_quality.push(0);
                            } else {
                                // 格式: each{"cnrtmplive02.e.vhall.com": [2, 4, 6], ...}
                                var obj;
                                if (type === "mobile_cdn") {
                                    obj = mobile_cdn;
                                } else if (type === "flash_cdn") {
                                    obj = flash_cdn;
                                } else if (type === "h5_cdn") {
                                    obj = h5_cdn;
                                }
                                $.each(obj, function(i, elem) {
                                    if (!(elem in each)) {
                                        each[elem] = [];
                                    }

                                    if (alluser[type]) {
                                        each[elem].push(alluser[type][elem] || 0);
                                    } else {
                                        each[elem].push(0);
                                    }

                                });

                                $.each(obj, function(i, elem) {
                                    if (!(elem in each_bad)) {
                                        each_bad[elem] = [];
                                    }
                                    if (baduser[type]) {
                                        each_bad[elem].push(baduser[type][elem] || 0);
                                    } else {
                                        each_bad[elem].push(0);
                                    }

                                });
                            }

                        });

                        if (type === "total") {
                            legend = ["app", "flash", "h5"];

                            $([app, flash, h5]).each(function(i, d) {
                                series.push({
                                    name: legend[i],
                                    type: "bar",
                                    stack: '总量',
                                    data: d
                                });
                            });

                            $([app_quality, flash_quality, h5_quality]).each(function(i, d) {
                                series_quality.push({
                                    name: legend[i],
                                    type: "line",
                                    data: d
                                });
                            });

                        } else {
                            legend = _.keys(each);

                            $.each(legend, function(i, o) {
                                series.push({
                                    name: legend[i],
                                    type: "bar",
                                    stack: '总量',
                                    data: each[o]
                                });
                            });

                            $.each(each, function(k, v) { // {"cnrtmplive02.e.vhall.com": [2, 4, 6]}
                                each_quality[k] = [];
                                $.each(v, function(i, j) { // 如: [2, 4, 6]
                                    each_bad[k] && each_quality[k].push(_formula(j, each_bad[k][i]));
                                });
                            });

                            $.each(legend, function(i, o) {
                                series_quality.push({
                                    name: legend[i],
                                    type: "line",
                                    data: each_quality[o]
                                });
                            });
                        }

                        var template = _.template($("#tpl_modal_summery_count").html());
                        var html = template({
                            num: times.length
                        });
                        var box = $(".ui.modal.vh-modal-summery-count");
                        box.find(".content").html(html);

                        var graph = box.find(".vh-summery-count-graph-statistics");
                        monitor_summery_count_graph_statistics(graph[0], times, legend, series);

                        graph = box.find(".vh-summery-count-graph-quality");
                        monitor_summery_count_graph_quality(graph[0], times, legend, series_quality);
                    }, null);
                }
            })
            .modal('setting', 'transition', "slide up")
            .modal('show').modal("refresh");
    });
}

function monitor_table_graph(dom, axis, all, host, stream) {
    var myChart = E.init(dom);

    // 指定图表的配置项和数据
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['活动', '本机', '全部']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: axis
        },
        yAxis: {
            type: 'value',
            minInterval: 1
        },
        series: [{
            name: "活动",
            type: "line",
            data: stream
        }, {
            name: "本机",
            type: "line",
            data: host
        }, {
            name: "全部",
            type: "line",
            data: all
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

/**
 * 汇总统计图
 * @param dom
 * @param axis
 * @param legend
 * @param series
 */
function monitor_summery_count_graph_statistics(dom, axis, legend, series) {
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
        dataZoom: [{
            show: true,
            realtime: true,
            start: 0,
            end: 100,
            xAxisIndex: 0
            ,bottom: 0
        }],
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
                rotate: -30
            },
            data: axis
        }],
        yAxis: [{
            name : '个数',
            type : 'value'
        }],
        series: series
    };

    myChart.setOption(option);
}

function monitor_summery_count_graph_quality(dom, axis, legend, series) {
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
        dataZoom: [{
            show: true,
            realtime: true,
            start: 0,
            end: 100,
            xAxisIndex: 0
            ,bottom: 0
        }],
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
                rotate: -30
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

// -------------------------------------------------------------------------------//

/**
 * 生成模版(id="tpl_td_list")
 * @param data  {Array}    每一个单元格td的数据 如: 直播助手
 * @param streamID {String}  作为key的streamID
 * @param k  {String}       模块编号
 * @returns {string}  返回生成的模版
 * @private
 */
function _genList(data, streamID, k) {
    var now = {}, history = {};
    var oNow = data["now"],
        oHistory = data["history_error"];

    now["code"] = oNow.code; // 记录code
    now["desc"] = Tool.getMessage(oNow.code); // 记录描述文字
    now["date"] = Tool.dateFormat(new Date(oNow.timestamp * 1000), "yyyy-MM-dd hh:mm:ss.S"); // 记录格式化时间
    now["level"] = oNow.type; // 记录level
    now["bg"] = Constant.level[oNow.type]; // 记录bg

    if (oHistory) {
        history["code"] = oHistory.code; // 记录code
        history["desc"] = Tool.getMessage(oHistory.code); // 记录描述文字
        history["date"] = Tool.dateFormat(new Date(oHistory.timestamp * 1000), "yyyy-MM-dd hh:mm:ss.S"); // 记录格式化时间
        history["level"] = oHistory.type; // 记录level
        history["bg"] = Constant.level[oHistory.type]; // 记录bg
    } else {
        history = null;
    }

    var error_no = data["error_no"];
    var num = _.reduce(error_no, function(result, value, key) {
        return parseInt(result, 10) + parseInt(value, 10);
    }, 0);

    return template({
        row1: now,
        row2: history,
        errorNum: num || 0,
        id: streamID,
        k: k
    });

}

/**
 *
 * @param data  一行数据
 * @param type  类型
 * @param k     模块编号
 * @private
 */
function _genCollect(data, type, k) {
    //if (data["user"]["alluser"] > 0) {
        var streamID = data["streamid"];
        var all = data["user"]["cdn"][k];
        var arr = [];
        var sum = 0, total = 0;
        $.each(all, function(k, v) { // k: cdn地址  v: {2: xxx, 4: xxx}
            var o = {};
            o[k] = v["4"] + "/" + (v["2"] + v["4"]);
            arr.push(o);
            sum += v["4"];
            total += v["2"] + v["4"];
        });

        if (total === 0 && k == 6) { // 还为0 手动添加链接地址
            arr.push({
                "cnrtmplive01.open.vhall.com": "-/-"
            });
        }

        return templateCollect({
            sum: sum,
            total: total,
            items: arr.slice(0, 3),
            itemsRest: arr.length > 3 ? arr.slice(3) : [],
            id: streamID,
            k: k,
            type: type
            ,more: arr.length > 3
        });
    //} else {
    //    return "**";
    //}
}

function _genImg() {
    $("[data-src]").each(function(idx, elem) {
        var dom = $(elem).parent();
        var maxH = 100;
        var img = new Image();
        img.className = "ui small image";
        img.src = $(elem).attr("data-src");
        img.onload = function () {
            var imgW = img.width;
            var imgH = img.height;
            var w = dom.width(), h;
            h = maxH;
            w = imgW * h / imgH;
            $(img).width(w).height(h);
            dom.height(h);
            dom.css({
                textAlign: "-webkit-center"
            });
            dom.empty().append(img);
        };
        img.onerror = function() {
            img.src = "images/error.png";
        };
        $(elem).removeAttr("data-src");
    });
}

function _table_order() {
    // 自定义sort
    $.fn.dataTable.ext.order['dom-error-number'] = function( settings, col ) {
        return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
            var dom = $(td).find('.vh-td-error-number');
            if (dom.length > 0) {
                return dom[0].innerHTML * 1;
            } else {
                return 0;
            }
        } );
    };

    $.fn.dataTable.ext.order['dom-user-number'] = function( settings, col ) {
        return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
            return $(td).find("a")[0].innerHTML * 1;
        } );
    };

    $.fn.dataTable.ext.order['dom-collect-number'] = function( settings, col ) {
        return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
            var a = $(td).find("a");
            if (a.length) {
                a = a[0].innerHTML;
                var offset = a.lastIndexOf("/");
                var n = a.slice(offset + 1);
                return n * 1;
            } else {
                return 0;
            }
        } );
    };
}

/**
 * toolbar筛选条件
 * @param {object} table 控件
 * @param {boolean} isMultiple 是否多重查询
 * @private
 */
function _filter(table, isMultiple) {
    var search = $.fn.dataTable.ext.search;

    // 多重查询
    !isMultiple &&　_default();

    var filters = _getFilter();
    if (filters) {
        $(filters).each(function(idx, item) {
            var col = parseInt(item.col, 10),
                dimension = item.dimension,
                oper = parseInt(item.oper, 10),
                val = item.val;
            var func;

            switch(col) {
                case 0: // 流ID
                    if (dimension === "length") { // 长度
                        switch(oper) {
                            case 1: // <=
                                func = function( settings, searchData, index, rowData, counter ) {
                                    return searchData[col].length <= parseInt(val, 10);
                                };
                                break;
                            case 2: // ==
                                func = function( settings, searchData, index, rowData, counter ) {
                                    return searchData[col].length == parseInt(val, 10);
                                };
                                break;
                            case 3: // >=
                                func = function( settings, searchData, index, rowData, counter ) {
                                    return searchData[col].length >= parseInt(val, 10);
                                };
                                break;
                            default:
                                _default();
                        }
                    } else if (dimension === "number") { // 大小
                        _default();
                    } else if (dimension === "text") { // 文本
                        switch(oper) {
                            case 4: // 包含
                                func = function( settings, searchData, index, rowData, counter ) {
                                    return searchData[col].indexOf(val) !== -1;
                                };
                                break;
                            case 5: // 不包含
                                func = function( settings, searchData, index, rowData, counter ) {
                                    return searchData[col].indexOf(val) === -1;
                                };
                                break;
                            case 1: case 2: case 3: default:
                            _default();
                        }
                    }
                    break;

                case 4: // 移动发起
                case 5: // SRS接收
                case 6: // SRS分发
                case 7: // 多码流转码
                case 8: // HLS切片
                case 9: // HLS同步
                case 10: // HLS回放
                    if (dimension === "number") {
                        switch(oper) {
                            case 1: // <=
                            case 2: // ==
                            case 3: // >=
                                func = function( settings, searchData, index, rowData, counter ) {
                                    var s = searchData[col];
                                    var reg = /<span class="vh-td-error-number">(\d+)<\/span>/;
                                    var match = reg.exec(s);
                                    if (match) {
                                        return _compare(parseInt(match[1], 10), parseInt(val, 10), oper);
                                    }
                                    return false;
                                };
                                break;
                            default:
                                _default();
                        }
                    } else if (dimension === "text") {
                        switch(oper) {
                            case 4: // 包含
                                func = function( settings, searchData, index, rowData, counter ) {
                                    var s = searchData[col];
                                    return s.indexOf(val) !== -1;
                                };
                                break;
                            case 5: // 不包含
                                func = function( settings, searchData, index, rowData, counter ) {
                                    var s = searchData[col];
                                    return s.indexOf(val) === -1;
                                };
                                break;
                            default:
                                _default();
                        }
                    } else {
                        _default();
                    }
                    break;

                case 15: // 卡顿用户数
                case 16: // 用户总数
                    if (dimension === "number") {
                        switch(oper) {
                            case 1: // <=
                            case 2: // ==
                            case 3: // >=
                                func = function( settings, searchData, index, rowData, counter ) {
                                    var s = searchData[col];
                                    var v = Tool.stripHTML(s);
                                    return _compare(parseInt(v, 10), parseInt(val, 10), oper);
                                };
                                break;
                            default:
                                _default();
                                break;
                        }
                    } else {
                        _default();
                    }
                    break;

                default:
                    _default();
            }

            func && search.push(func);
        });
    } else {
        _default();
    }

    table.draw();

    function _default() {
        search.length = 0;
    }

    function _compare(n1, n2, oper) {
        switch(oper) {
            case 1:
                return n1 <= n2;
                break;
            case 2:
                return n1 == n2;
                break;
            case 3:
                return n1 >= n2;
                break;
        }
    }
}

/**
 * 解析toolbar中的筛选条件
 * @returns {*[]} 无筛选条件  {array} 一个或多个条件
 * @private
 */
function _getFilter() {
    var toolbar = $(".vh-table-toolbar").eq(0);
    // 列 vh-tb-col
    var col = toolbar.find(".ui.dropdown.vh-tb-col").dropdown("get value");
    if (col && col.length === 0) {
        return null;
    }

    // 维度 vh-tb-dimension
    var dimension = toolbar.find(".ui.dropdown.vh-tb-dimension").dropdown("get value");
    if (dimension && dimension.length === 0) {
        return null;
    }

    // 操作 vh-tb-oper
    var oper = toolbar.find(".ui.dropdown.vh-tb-oper").dropdown("get value");
    if (oper && oper.length === 0) {
        return null;
    }

    // 值 vh-tb-val
    var val = toolbar.find(".ui.input.vh-tb-val input").val().trim();
    if (val == "") {
        return null;
    }

    return [{
        col: col,
        dimension: dimension,
        oper: oper,
        val: val
    }];
}

/**
 * 设置toolbar中的筛选条件
 * @param col
 * @param dimension
 * @param oper
 * @param val
 * @private
 */
function _setFilter(col, dimension, oper, val) {
    var toolbar = $(".vh-table-toolbar").eq(0);
    // 列 vh-tb-col
    toolbar.find(".ui.dropdown.vh-tb-col").dropdown("set selected", col);

    // 维度 vh-tb-dimension
    toolbar.find(".ui.dropdown.vh-tb-dimension").dropdown("set selected", dimension);

    // 操作 vh-tb-oper
    toolbar.find(".ui.dropdown.vh-tb-oper").dropdown("set selected", oper);

    // 值 vh-tb-val
    toolbar.find(".ui.input.vh-tb-val input").val(val);
}

function _resetFilter() {
    var toolbar = $(".vh-table-toolbar").eq(0);
    // 列 vh-tb-col
    toolbar.find(".ui.dropdown.vh-tb-col").dropdown("restore defaults");

    // 维度 vh-tb-dimension
    toolbar.find(".ui.dropdown.vh-tb-dimension").dropdown("restore defaults");

    // 操作 vh-tb-oper
    toolbar.find(".ui.dropdown.vh-tb-oper").dropdown("restore defaults");

    // 值 vh-tb-val
    toolbar.find(".ui.input.vh-tb-val input").val("");
}

function _formula(total, bad) {
    if (total === bad) {
        return 0;
    }
    var n = ((total - bad) / total * 100).toFixed(2);
    return n < 0 ? 0 : n;
}
