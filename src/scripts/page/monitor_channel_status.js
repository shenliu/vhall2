/**
 * Created by shen on 2016/7/28.
 */

require("semantic/semantic.min.css");
require("../../css/lib/jquery.dataTables.min.css");
require("../../css/common/common.less");
require("../../css/page/monitor.less");
//require("../../css/page/channel_status.less");

import * as _ from 'lodash';

import {Constant} from './constant';

import {Tool} from './tool';

$(function () {
    var id = Tool.urlParam("id", location.search.slice(1));
    if (!id) {
        return;
    }

    console.log(id);
});
