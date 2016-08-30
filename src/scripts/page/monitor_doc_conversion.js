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
            , "order": [[5, "desc"]]
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
                // 232101 转换服务启动 idx: 3
                data: "232101",
                render: function (data, type, row, meta) {
                    if (data) {
                        return _html("232101", row, table, meta);
                    } else {
                        return "-";
                    }
                }
            }, {
                // 232001 成功收到任务 idx: 4
                data: "232001",
                render: function (data, type, row, meta) {
                    if (data) {
                        return _html("232001", row, table, meta);
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
                // 232011 转换任务开始 idx: 6
                data: "232011",
                render: function (data, type, row, meta) {
                    if (data) {
                        return _html("232011", row, table, meta);
                    } else {
                        return "-";
                    }
                }
            }, {
                // 232002 转换任务完成 idx: 7
                data: "232002",
                render: function (data, type, row, meta) {
                    if (data) {
                        return _html("232002", row, table, meta);
                    } else {
                        return "-";
                    }
                }
            }, {
                // 234011 转换任务失败 idx: 8
                data: "234011",
                render: function (data, type, row, meta) {
                    if (data) {
                        return _html("234011", row, table, meta);
                    } else {
                        return "-";
                    }
                }
            }]
        });
    }

}

function _html(code, row, table, meta) {
    var s = row[code]["attr"].slice(1, -1);
    var html = ["<ul>"];
    $.each(s.split(","), function (idx, elem) {
        html.push('<li>', elem, '</li>');
    });
    var tr = table.row(meta.row).node();
    row[code]["type"] == 4 && $(tr).addClass("danger-bg");
    html.push("</ul>");
    return html.join("");
}
