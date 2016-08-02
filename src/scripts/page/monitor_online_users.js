/**
 * Created by shen on 2016/7/18.
 *
 * 在线用户
 */

"use strict";

require("semantic/semantic.min.css");
require("../../css/common/common.less");
require("../../css/page/monitor.less");

var E = require("echarts/dist/echarts.min");

import {Constant} from './constant';

import {Tool} from './tool';

var EACH_LINE = 6; // 每行6个
var MAP = {
    1: "one", 2: "two", 3: "three", 4: "four", 5: "five",
    6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten"
};

// init
$(function () {
    var search = location.search.slice(1);
    var col = parseInt(search, 10);
    if (!isNaN(col)) {
        if (col < 1) {
            col = 1;
        }
        if (col > 10) {
            col = 10;
        }
        EACH_LINE = col;
    }
    monitor_online_users();
    Tool.dropdown();
});

/**
 *  第一个pie图 总览图 组织数据
 */
function monitor_online_users() {
    var datas = [];
    Tool.xhr_get(Constant.url.monitor_online_users, function (data, textStatus, jqXHR) {
        var cdn = data["cdn"];
        var keys = _.keys(cdn);
        var total = keys.length + 1;

        // 处理全部用户的
        var o = {
            "alluser": data["alluser"],
            "baduser": data["baduser"],
            "name": "全部用户",
            "dom": ".vh-online-users-0"
        };
        datas.push(o);

        $(keys).each(function (idx, elem) {
            o = {
                "alluser": cdn[elem]["alluser"],
                "baduser": cdn[elem]["baduser"],
                "name": elem || "-",
                "dom": ".vh-online-users-" + (idx + 1)
            };
            datas.push(o);
        });

        var lines = Math.ceil(total / EACH_LINE); // 需要几行 每行EACH_LINE个

        var html = [],
            n = 0;
        for (var i = 0; i < lines; i++) {
            html.push('<div class="' + MAP[EACH_LINE] + ' column row divided">');
            for (var j = 0; j < EACH_LINE; j++) {
                html.push('<div class="column">');
                html.push('<h5 class="ui header"></h5>');
                html.push('<div class="vh-online-users vh-online-users-' + (n++) + '"></div>');
                html.push('</div>');
            }
            html.push('</div>');
        }
        $(".vh-online-users-box").html(html.join(""));

        $.each(datas, function (k, v) {
            _gen(v);
        });

    }, null);

}

function _gen(obj) {
    var alluser = obj["alluser"],
        baduser = obj["baduser"],
        vals = [],
        series = [],
        dom;
    var legend = ["正常用户", "卡顿用户"];

    vals.push({
        name: "正常用户",
        value: alluser - baduser
    });
    vals.push({
        name: "卡顿用户",
        value: baduser
    });

    series.push({
        name: obj["name"],
        type: 'pie',
        radius: '60%',
        center: ['50%', '60%'],
        data: vals,
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    });
    dom = $(obj["dom"]);
    alluser && _graph(dom[0], legend, series);

    dom.prev(".ui.header").html(obj["name"] + " (" + baduser + "/" + alluser + ")"); // h5 标题
}

/**
 * 饼状图
 * @param dom
 * @param legend
 * @param series
 */
function _graph(dom, legend, series) {
    var myChart = E.init(dom);

    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ['#2f4554', '#c23531'],
        legend: {
            //orient: 'vertical',
            left: 'left',
            data: legend
        },
        series: series
    };

    if ($(dom).hasClass("vh-online-users-0")) {
        option["color"] = ['#2b821d', '#cda819'];
    }

    myChart.setOption(option);
}
