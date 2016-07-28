/**
 * Created by shen on 2016/7/27.
 */

require("semantic/semantic.min.css");
require("../../css/lib/jquery.dataTables.min.css");
require("../../css/common/common.less");
require("../../css/page/monitor.less");
require("../../css/page/mod_management.less");

import * as _ from 'lodash';

import {Constant} from './constant';

import {Tool} from './tool';

$(function () {
    init();
    Tool.dropdown();
});

let tpl_table_list = _.template($("#tpl-table-list").html());

function init() {
    var html = tpl_table_list({
        modName: "助手",
        modCode: "1"
    });

    $("#vh-table-list-bar").append(html);
}
