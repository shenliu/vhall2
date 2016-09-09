/**
 * Created by shen on 2016/7/18.
 */

"use strict";

require("semantic/semantic.min.css");
require("../../css/lib/jquery.dataTables.min.css");
require("../../css/common/common.less");
require("../../css/page/monitor.less");

import {Constant} from './constant';

import {Tool} from './tool';

$(function () {
    monitor_doc_conversion_table();
    Tool.dropdown();
});

/**
 * 生成table数据
 */
function monitor_doc_conversion_table() {
    var url = Constant.url.monitor_doc_conversion;

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
                "dataSrc": function(data) {
                    var arr = [];
                    $.each(data, function(k, v) {
                        v["sessionID"] = k;
                        arr.push(v);
                    });
                    return arr;
                }
            }
            , "order": [[2, "desc"]]
            , "columns": [{
                // ID idx: 0
                data: "streamid"
            }, {
                // hostname idx: 1
                data: "hostname"
            }, {
                // session ID idx: 2
                data: "sessionID"
            }, {
                // 232001 转换服务启动 idx: 3
                data: "232001",
                render: function (data, type, row, meta) {
                    if (data) {
                        return _html("232001", row, table, meta);
                    } else {
                        return "-";
                    }
                }
            }, {
                // 232002 成功收到任务 idx: 4
                data: "232002",
                render: function (data, type, row, meta) {
                    if (data) {
                        return _html("232002", row, table, meta);
                    } else {
                        return "-";
                    }
                }
            }, {
                // 234001 接收任务失败 idx: 5
                data: "234001",
                render: function (data, type, row, meta) {
                    if (data) {
                        return _html("234001", row, table, meta);
                    } else {
                        return "-";
                    }
                }
            }, {
                // 232003 转换任务开始 idx: 6
                data: "232003",
                render: function (data, type, row, meta) {
                    if (data) {
                        return _html("232003", row, table, meta);
                    } else {
                        return "-";
                    }
                }
            }, {
                // 232004 转换任务完成 idx: 7
                data: "232004",
                render: function (data, type, row, meta) {
                    if (data) {
                        return _html("232004", row, table, meta);
                    } else {
                        return "-";
                    }
                }
            }, {
                // 转换时长(秒) idx: 8
                data: "234007",
                render: function(data, type, row, meta) {
                    if (data) { // 如果转换任务失败 就返回"-"
                        return "-";
                    } else {
                        return _last(row, table, meta);
                    }
                }
            }, {
                // 234007 转换任务失败 idx: 9
                data: "234007",
                render: function (data, type, row, meta) {
                    if (data) {
                        return _html("234007", row, table, meta);
                    } else {
                        return "-";
                    }
                }
            }, {
                // 232005 无需转换 idx: 10
                data: "232005",
                render: function (data, type, row, meta) {
                    if (data) {
                        return _html("232005", row, table, meta);
                    } else {
                        return "-";
                    }
                }
            }, {
                // 234002 解析校验任务数据失败 idx: 11
                data: "234002",
                render: function (data, type, row, meta) {
                    if (data) {
                        return _html("234002", row, table, meta);
                    } else {
                        return "-";
                    }
                }
            }, {
                // 234003 服务执行执行异常 idx: 12
                data: "234003",
                render: function (data, type, row, meta) {
                    if (data) {
                        return _html("234003", row, table, meta);
                    } else {
                        return "-";
                    }
                }
            }, {
                // 234004 文档MD5不匹配 idx: 13
                data: "234004",
                render: function (data, type, row, meta) {
                    if (data) {
                        return _html("234004", row, table, meta);
                    } else {
                        return "-";
                    }
                }
            }, {
                // 234005 转换为MS Office PPT失败 idx: 14
                data: "234005",
                render: function (data, type, row, meta) {
                    if (data) {
                        return _html("234005", row, table, meta);
                    } else {
                        return "-";
                    }
                }
            }, {
                // 234006 磁盘IO错误 idx: 15
                data: "234006",
                render: function (data, type, row, meta) {
                    if (data) {
                        return _html("234006", row, table, meta);
                    } else {
                        return "-";
                    }
                }
            }, {
                // 234008 转换服务异常退出 idx: 16
                data: "234008",
                render: function (data, type, row, meta) {
                    if (data) {
                        return _html("234008", row, table, meta);
                    } else {
                        return "-";
                    }
                }
            }]
        });
    }

}

function _html(code, row, table, meta) {
    var o = row[code];
    var s = o["attr"].slice(1, -1);
    var html = o["type"] == "4" ? ["<ul class='danger'>"] : ["<ul>"];
    $.each(s.split(","), function (idx, elem) {
        html.push('<li>', elem, '</li>');
    });
    //var tr = table.row(meta.row).node();
    //row[code]["type"] == 4 && $(tr).addClass("danger-bg");
    html.push("</ul>");
    return html.join("");
}

function _last(row, table, meta) {
    // 转换任务开始
    var str_start = row["232003"];

    // 转换任务完成
    var str_end = row["232004"];
    if (!str_start || !str_end) {
        return "-";
    }

    str_start = str_start["attr"];
    str_end = str_end["attr"];

    var reg = /"d":\s"(.*?)"/;
    var m1 = reg.exec(str_start);
    var m2 = reg.exec(str_end);
    if (m1 && m2) {
        return Tool.diffTime(m1[1], m2[1], "second");
    } else {
        return "-";
    }
}
