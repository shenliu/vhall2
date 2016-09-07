/**
 * Created by shen on 2016/7/18.
 */

"use strict";

require("semantic/semantic.min.css");
require("../../css/lib/jquery.dataTables.min.css");
require("../../css/lib/datetimepicker.css");
require("../../css/common/common.less");
require("../../css/page/monitor.less");

require('../../scripts/lib/bootstrap-datetimepicker.min');
require('../../scripts/lib/bootstrap-datetimepicker.zh-CN');

import {Constant} from './constant';

import {Tool} from './tool';

$(function () {
    _init(monitor_auto_search);
    monitor_log_search_event();
    Tool.dropdown();
});

function _init(callback) {
    $.when(
        // 流ID
        $.get(Constant.url.monitor_get_streams),
        // 主机
        $.get(Constant.url.monitor_get_hosts),
        // 模块
        $.get(Constant.url.monitor_get_mods),
        // 错误代码
        $.get(Constant.url.monitor_get_codes)
    ).done(function (data_id, data_host, data_mod, data_code) {
        data_id = JSON.parse(data_id[0]);
        data_host = JSON.parse(data_host[0]);
        data_mod = JSON.parse(data_mod[0]);
        data_code = JSON.parse(data_code[0]);

        $('.ui.dropdown')
            .dropdown({
                allowAdditions: true,
                forceSelection: true
            });

        // 流ID
        let html = ['<div class="item" data-value="">无</div>'];
        $(data_id).each(function (i, elem) {
            html.push('<div class="item" data-value="', elem, '">', elem, '</div>');
        });
        $(".vh-search-id").find(".menu").html(html.join(""));

        // 主机
        html = ['<div class="item" data-value="">无</div>'];
        $(data_host).each(function (i, elem) {
            html.push('<div class="item" data-value="', elem, '">', elem, '</div>');
        });
        $(".vh-search-host").find(".menu").html(html.join(""));

        // 模块
        html = ['<div class="item" data-value="">无</div>'];
        $(data_mod).each(function (i, elem) {
            html.push('<div class="item" data-value="', elem, '">', Tool.getModule(elem), '</div>');
        });
        $(".vh-search-module").find(".menu").html(html.join(""));

        // 错误代码
        html = ['<div class="item" data-value="">无</div>'];
        $(data_code).each(function (i, elem) {
            html.push('<div class="item" data-value="', elem, '">', elem, '</div>');
        });
        $(".vh-search-code").find(".menu").html(html.join(""));

        // 日期
        /*var now = new Date(),
            until = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);

        $('#vh-date');

        $('#vh-date');*/

        // 时间
        var now = new Date(),
            hour = now.getHours();
        $('#vh-time-start').datetimepicker({
            language: 'zh-CN',
            format: 'hh:ii:00',
            weekStart: 1,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 1,
            minView: 0,
            maxView: 1,
            forceParse: 0
        }).val(hour + ':00:00');

        var nextHour = hour + 1;
        if (nextHour === 24) {
            nextHour = "00";
        }
        $('#vh-time-end').datetimepicker({
            language: 'zh-CN',
            format: 'hh:ii:00',
            weekStart: 1,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 1,
            minView: 0,
            maxView: 1,
            forceParse: 0
        }).val(nextHour + ':00:00');

        callback && callback();
    });
}

function monitor_log_search_event() {
    var bar = $(".vh-search-bar");

    // 查询按钮
    bar.find(".vh-search-btn").on("click", function (e) {
        var id, host, module, code, type, date, timeStart, timeEnd;

        // 流ID
        id = bar.find(".ui.dropdown.vh-search-id").dropdown("get value");

        // 主机
        host = bar.find(".ui.dropdown.vh-search-host").dropdown("get value");

        // 模块
        module = bar.find(".ui.dropdown.vh-search-module").dropdown("get value");
        if (module == "") {
            _message();
            return;
        }

        // 错误代码
        code = bar.find(".ui.dropdown.vh-search-code").dropdown("get value");

        // 类型
        type = bar.find(".ui.dropdown.vh-search-type").dropdown("get value");

        // 时间范围
        /*date = bar.find("#vh-date").val();*/
        timeStart = bar.find("#vh-time-start").val();
        timeEnd = bar.find("#vh-time-end").val();

        $(e.currentTarget).addClass("loading").attr("disabled", "disabled");

        monitor_log_search_table(id, host, module, code, type, date, timeStart, timeEnd);
    });

    // message close
    $(".vh-search-warning").on("click", ".close.icon", function () {
        $(".ui.message.vh-search-warning").hide("normal");
    });

    // 警告
    function _message() {
        $(".ui.message.vh-search-warning").show("fast", function () {
            var that = $(this);
            setTimeout(function () {
                that.hide("normal");
            }, 2500);
        });
    }
}

/**
 * 生成table数据
 * @param id
 * @param host
 * @param module
 * @param code
 * @param type
 * @param date
 * @param timeStart
 * @param timeEnd
 */
function monitor_log_search_table(id, host, module, code, type, date, timeStart, timeEnd) {
    var url = Constant.url.monitor_log_search
        .replace("{mod}", module)
        .replace("{start}", timeStart)
        .replace("{end}", timeEnd);
    if (id) {
        url += "&streamid=" + id;
    }
    if (host) {
        url += "&hostname=" + host;
    }
    if (code) {
        url += "&code=" + code;
    }
    if (type) {
        url += "&type=" + type;
    }

    var $table = $("table.ui.table");

    if ($.fn.dataTable.tables().length) {
        // 如果第二次 只改变url值
        $.fn.dataTable.tables({api: true}).ajax.url(url).load();
    } else {
        var table = $table.DataTable({
            destroy: true,
            "dom": 'iftlp',
            "language": Constant.tableLocale
            , "autoWidth": false
            , "scrollX": true
            , "lengthMenu": [[25, 50, 75, 100, -1], [25, 50, 75, 100, '全部']]
            , "ajax": {
                "url": url,
                "dataSrc": function (json) {
                    console.log(json);
                    return json;
                }
            }
            , "order": [[4, "desc"]]
            , "columns": [{
                // 流ID idx: 0
                data: "streamid"
            }, {
                // 主机名 idx: 1
                data: "hostname"
            }, {
                // 模块 idx: 2
                data: "mod",
                render: function (data, type, row, meta) {
                    if (data) {
                        return Tool.getModule(row["mod"]);
                    } else
                        return "-";
                }
            }, {
                // 错误代码 idx: 3
                data: "code",
                render: function (data, type, row, meta) {
                    if (data) {
                        return data + " " + Tool.getMessage(row["code"]);
                    } else
                        return "-";
                }
            }, {
                // 时间 idx: 4
                data: "timestamp",
                render: function (data, type, row, meta) {
                    if (data) {
                        return Tool.dateFormat(new Date(data * 1000), "yyyy-MM-dd hh:mm:ss.S");
                    } else
                        return "-";
                }
            }, {
                // src_ip idx: 5
                data: "src_ip",
                render: function (data, type, row, meta) {
                    return data || "-";
                }
            }, {
                // ci idx: 6
                data: "ci",
                render: function (data, type, row, meta) {
                    return data || "-";
                }
            }, {
                // uid idx: 7
                data: "uid",
                render: function (data, type, row, meta) {
                    return data || "-";
                }
            }, {
                // log_id idx: 8
                data: "log_id",
                render: function (data, type, row, meta) {
                    return data || "-";
                }
            }, {
                // tt idx: 9
                data: "tt",
                render: function (data, type, row, meta) {
                    return data || "-";
                }
            }, {
                // pid idx: 10
                data: "pid",
                render: function (data, type, row, meta) {
                    return data || "-";
                }
            }, {
                // si idx: 11
                data: "si",
                render: function (data, type, row, meta) {
                    return data || "-";
                }
            }, {
                // log_session idx: 12
                data: "log_session",
                render: function (data, type, row, meta) {
                    return data || "-";
                }
            }, {
                // s idx: 13
                data: "s",
                render: function (data, type, row, meta) {
                    return data || "-";
                }
            }, {
                // sd idx: 14
                data: "sd",
                render: function (data, type, row, meta) {
                    return data || "-";
                }
            }, {
                // attr idx: 15
                data: "attr",
                render: function (data, type, row, meta) {
                    var html = ["<ul>"];
                    data = data.replace(/\n/g, "");
                    $.each(JSON.parse(data), function (k, v) {
                        html.push('<li>', k, ": ", v, '</li>');
                    });
                    html.push("</ul>");
                    return html.join("");
                }
            }, {
                // type idx: 16
                data: "type",
                render: function (data, type, row, meta) {
                    if (data == 4) {
                        var tr = table.row(meta.row).node();
                        $(tr).addClass("danger-bg");
                    }
                    return data || "-";
                }
            }]
        });

        table.on('draw', function (e) {

        }).on('xhr', function () {
            // 恢复<查询>按钮的状态
            $(".vh-search-btn").removeClass("loading").attr("disabled", false);
        }).on('init', function () {
            // 隐藏type栏
            table.column(16).visible(false);
        });
    }

}

/**
 * url有search时 自动运行
 * @param params
 */
function monitor_auto_search(params) {
    var host, module, id, code, start, end;
    if (params) {

    } else {
        var search = location.search.slice(1);
        if (search.charAt(search.length - 1) == "?") {
            search = search.slice(0, -1);
        }
        if (search == "") {
            return;
        }
        host = Tool.urlParam("host", search);
        module = Tool.urlParam("module", search);
        id = Tool.urlParam("id", search);
        code = Tool.urlParam("code", search);
        start = Tool.urlParam("start", search);
        end = Tool.urlParam("end", search);
    }

    var bar = $(".vh-search-bar");

    if (id) {
        bar.find(".ui.dropdown.vh-search-id").dropdown("set selected", id);
    }

    if (host && host != "None") {
        bar.find(".ui.dropdown.vh-search-host").dropdown("set selected", host);
    }

    if (module) {
        bar.find(".ui.dropdown.vh-search-module").dropdown("set selected", module);
    }

    if (code) {
        bar.find(".ui.input.vh-search-code input").val(code);
    }

    if (start) {
        bar.find("#vh-date").val(Tool.dateFormat(new Date(), "yyyy/MM/dd"));
        bar.find("#vh-time-start").val(start + ":00:00");
        bar.find("#vh-time-end").val(end + ":00:00");
    }

    bar.find(".vh-search-btn").trigger("click");
}
