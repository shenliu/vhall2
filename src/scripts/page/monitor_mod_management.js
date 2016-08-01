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

let mod_codes = [1,3,5,7,9]; // 记录已经存在的模块ID

import {Tool} from './tool';

$(function () {
    init();
    event();
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

function event() {
    // 添加 模块
    $("#vh-add-mod").on("click", function(e) {
        _modal_mod(e);
    });

    $(document).on("click", ".vh-mod-edit", function(e) {
        _modal_mod(e, 1);
    });

    function _modal_mod(e, edit) {
        var btn = $(e.currentTarget);
        $(".ui.modal.vh-modal-mod")
            .modal({
                closable: false,
                onShow: function () {
                    var parent = btn.parents(".vh-mod");
                    var modal = $(".ui.modal.vh-modal-mod");
                    var codeNode = modal.find("[name=mod_code]");
                    var nameNode = modal.find("[name=mod_name]");
                    $(codeNode).on("focus", function(e) {
                        _focus(e, modal);
                    });
                    $(nameNode).on("focus", function(e) {
                        _focus(e, modal);
                    });
                    if (edit) {
                        var name = parent.find(".vh-mod-name").html();
                        var code = parent.find(".vh-mod-code span").html();
                        codeNode.val(code);
                        codeNode.attr("readonly", true);
                        nameNode.val(name);
                        modal.find("[type=hidden]").val("edit"); // 区分是新建还是编辑
                    } else {
                        codeNode.val("");
                        codeNode.attr("readonly", false);
                        nameNode.val("");
                        modal.find("[type=hidden]").val(""); // 区分是新建还是编辑
                    }
                },
                onApprove: function($element) {
                    var modal = $(".ui.modal.vh-modal-mod");
                    var type = modal.find("[type=hidden]").val();
                    var name = modal.find("[name=mod_name]");
                    var code = modal.find("[name=mod_code]");

                    // 判断code和name是否填写
                    var hasError = false;
                    var codeVal = code.val().trim();
                    var nameVal = name.val().trim();

                    if (nameVal == "") {
                        name.addClass("error-table");
                        hasError = true;
                    }

                    if (codeVal == "") {
                        code.addClass("error-table");
                        hasError = true;
                    }
                    if (hasError) {
                        modal.find(".ui.error.message").html("请输入编号和名称").show();
                        return false;
                    }

                    // 判断在新建情况下 code值是否重复 利用mod_codes数组
                    codeVal = parseInt(codeVal, 10);
                    if (type == "edit") { // 编辑

                    } else { // 新建
                        if (_.indexOf(mod_codes, codeVal) !== -1) {
                            code.addClass("error-table");
                            modal.find(".ui.error.message").html("模块编号已经存在").show();
                            return false;
                        }
                    }
                }
            }).modal('setting', 'transition', "slide up")
            .modal('show').modal("refresh");
    }

    function _focus(e, modal) {
        var target = $(e.currentTarget);
        target.removeClass("error-table");
        modal.find(".ui.error.message").html("").hide();
    }
}
