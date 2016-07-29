/**
 * Created by shen on 2016/7/28.
 */

require("semantic/semantic.min.css");
require("../../css/lib/jquery.dataTables.min.css");
require("../../css/common/common.less");
require("../../css/page/monitor.less");
require("../../css/page/channel_status.less");

import * as _ from 'lodash';

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

    channel_table();
});

function channel_table() {
    tpl = _.template($("#tpl_td_list").html());
    var $table = $("table.ui.table");
    table = $table.DataTable({
        "dom": 'if<t>lp',
        "language": Constant.tableLocale
        ,"autoWidth": false
        ,"scrollX": true
        ,"lengthMenu": [[25, 50, 75, 100, -1], [25, 50, 75, 100, '全部']]
        ,"ajax": {
            "url": Constant.url.monitor_stream_mod_history.replace("{id}", streamID),
            "dataSrc": ""
        }
        ,"order": [[ 0, "desc" ]]
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
            // 移动 idx: 10
            data: "6",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["6"], "6");
                } else
                    return "-";
            }
        }, {
            // Flash idx: 11
            data: "7",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["7"], "7");
                } else
                    return "-";
            }
        }, {
            // 截图 idx: 12
            data: "15",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["15"], "15");
                } else
                    return "-";
            }
        }, {
            // 文档转换 idx: 13
            data: "23",
            render: function (data, type, row, meta) {
                if (data) {
                    return _genList(row["23"], "23");
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
    // more...
    $('.ui.accordion').accordion({
        selector: {
            trigger: '.title.vh-more'
        }
    });
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
        items: arr.slice(0, 3),
        itemsRest: arr.length > 3 ? arr.slice(3) : [],
        more: arr.length > 3,
        id: streamID,
        k: k
    });
}
