/**
 * Created by shen on 2016/7/25.
 */

"use strict";

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
            username: {
                identifier: 'username',
                rules: [
                    {
                        type: 'empty',
                        prompt: '请输入用户名'
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
            var form = $(".vh-login-form")[0];
            /*var user = form.find("[name='username']").val();
            var pass = form.find("[name='password']").val();
            $.ajax({
                url: Constant.url.login,
                type: "POST",
                data: {
                    "username": user,
                    "password": pass
                },
                //crossDomain: true,
                //contentType: "application/json",
                success: function (data, textStatus, jqXHR) {
                    //console.log(data, textStatus, jqXHR);
                    if ("NO" === data) { // 登录错误
                        $(".ui.error.message").html("用户名或密码错误").show();
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest, textStatus, errorThrown);
                }
            });*/
            form.action = Constant.url.login;
            //form.method = "POST";
            form.submit();
        }
    });
}