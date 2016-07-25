/**
 * Created by shen on 2016/7/25.
 */

require("semantic/semantic.min.css");
require("../../css/common/common.less");
require("../../css/page/login.less");

import {Constant} from './constant';

import {Tool} from './tool';

$(function() {
    constraint();
});

function constraint() {
    $('.vh-login-form').form({
        fields: {
            email: {
                identifier: 'email',
                rules: [
                    {
                        type: 'empty',
                        prompt: '请输入电子邮件地址'
                    },
                    {
                        type: 'email',
                        prompt: '请输入正确的电子邮件地址'
                    }
                ]
            },
            password: {
                identifier: 'password',
                rules: [
                    {
                        type: 'empty',
                        prompt: '请输入密码'
                    }
                ]
            }
        },

        onSuccess: function (e) {
            e.preventDefault();
            var form = $(".bt-login-form");
            var user = form.find("[name='email']").val();
            var pass = form.find("[name='password']").val();
            $.ajax({
                url: Constant.url.login,
                type: "post",
                data: JSON.stringify({
                    "user_email": user,
                    "password": pass
                }),
                contentType: "application/json",
                success: function (data, textStatus, jqXHR) {
                    //console.log(data, textStatus, jqXHR);
                    if (data.st === -1) { // 登录错误
                        $(".ui.error.message").html(data.msg).show();
                    } else { // 成功
                        var next = Tool.urlParam("next") || "/";
                        location.href = decodeURIComponent(next);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest, textStatus, errorThrown);
                }
            });
        }
    });
}