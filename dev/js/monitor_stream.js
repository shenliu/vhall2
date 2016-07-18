webpackJsonp([6],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {"use strict";
	
	var _constant = __webpack_require__(3);
	
	var _tool = __webpack_require__(32);
	
	/**
	* Created by shen on 2016/7/18.
	*/
	
	__webpack_require__(4);
	__webpack_require__(22);
	__webpack_require__(29);
	__webpack_require__(30);
	
	var semantic = __webpack_require__(31);
	
	var _ = __webpack_require__(33);
	
	var E = __webpack_require__(35);
	
	/*
	   保存每个td中的数据
	   {
	        streamID: {
	            "1": [],
	            "2": [],
	            ...
	            "alluser": {}
	        }
	   }
	 */
	var streamData = {};
	
	// init
	$(function () {
	    monitor_table();
	    monitor_table_event();
	});
	
	function monitor_table() {
	    var reloadInterval, countDownInterval;
	
	    var templateCollect = _.template($("#tpl_td_collect").html());
	    var template = _.template($("#tpl_td_list").html());
	
	    // 自定义sort
	    $.fn.dataTable.ext.order['dom-error-number'] = function (settings, col) {
	        return this.api().column(col, { order: 'index' }).nodes().map(function (td, i) {
	            var dom = $(td).find('.vh-td-error-number');
	            if (dom.length > 0) {
	                return dom[0].innerHTML * 1;
	            } else {
	                return 0;
	            }
	        });
	    };
	
	    $.fn.dataTable.ext.order['dom-user-number'] = function (settings, col) {
	        return this.api().column(col, { order: 'index' }).nodes().map(function (td, i) {
	            return $(td).find("a")[0].innerHTML * 1;
	        });
	    };
	
	    $.fn.dataTable.ext.order['dom-collect-number'] = function (settings, col) {
	        return this.api().column(col, { order: 'index' }).nodes().map(function (td, i) {
	            var a = $(td).find("a");
	            if (a.length) {
	                a = a[0].innerHTML;
	                var offset = a.lastIndexOf("/");
	                var n = a.slice(offset + 1);
	                return n * 1;
	            } else {
	                return 0;
	            }
	        });
	    };
	
	    var $table = $("table.ui.table");
	    var table = $table.DataTable({
	        "dom": 'if<"vh-table-toolbar">tlp',
	        "language": _constant.Constant.tableLocale,
	        "autoWidth": false,
	        "scrollX": true,
	        "lengthMenu": [[25, 50, 75, 100, -1], [25, 50, 75, 100, '全部']],
	        "ajax": {
	            "url": _constant.Constant.url.monitor_stream,
	            "dataSrc": ""
	        },
	        "order": [[14, "desc"]],
	        "columns": [{
	            // 流ID idx: 0
	            data: "streamid",
	            render: function render(data, type, row, meta) {
	                if (data) return data.substring(0, 32);else return "";
	            }
	        }, {
	            // 流信息 idx: 1  todo
	            data: "baduser.user"
	
	        }, {
	            // 第三方 idx: 2
	            data: "20.log_list",
	            render: function render(data, type, row, meta) {
	                if (data) {
	                    return _genList(row["20"], row["streamid"], "20", template);
	                } else return "-";
	            }
	        }, {
	            // 直播助手 idx: 3
	            orderDataType: "dom-error-number",
	            type: "numeric",
	            data: "1.log_list",
	            render: function render(data, type, row, meta) {
	                if (data) {
	                    return _genList(row["1"], row["streamid"], "1", template);
	                } else return "-";
	            }
	        }, {
	            // 移动发起 idx: 4
	            orderDataType: "dom-error-number",
	            type: "numeric",
	            data: "5.log_list",
	            render: function render(data, type, row, meta) {
	                if (data) {
	                    return _genList(row["5"], row["streamid"], "5", template);
	                } else return "-";
	            }
	        }, {
	            // SRS接收 idx: 5
	            orderDataType: "dom-error-number",
	            type: "numeric",
	            data: "2.log_list",
	            render: function render(data, type, row, meta) {
	                if (data) {
	                    return _genList(row["2"], row["streamid"], "2", template);
	                } else return "-";
	            }
	        }, {
	            // SRS分发 idx: 6
	            orderDataType: "dom-error-number",
	            type: "numeric",
	            data: "11.log_list",
	            render: function render(data, type, row, meta) {
	                if (data) {
	                    return _genList(row["11"], row["streamid"], "11", template);
	                } else return "-";
	            }
	        }, {
	            // 多码流转码 idx: 7
	            orderDataType: "dom-error-number",
	            type: "numeric",
	            data: "16.log_list",
	            render: function render(data, type, row, meta) {
	                if (data) {
	                    return _genList(row["16"], row["streamid"], "16", template);
	                } else return "-";
	            }
	        }, {
	            // HLS切片 idx: 8
	            orderDataType: "dom-error-number",
	            type: "numeric",
	            data: "12.log_list",
	            render: function render(data, type, row, meta) {
	                if (data) {
	                    return _genList(row["12"], row["streamid"], "12", template);
	                } else return "-";
	            }
	        }, {
	            // HLS同步 idx: 9
	            orderDataType: "dom-error-number",
	            type: "numeric",
	            data: "13.log_list",
	            render: function render(data, type, row, meta) {
	                if (data) {
	                    return _genList(row["13"], row["streamid"], "13", template);
	                } else return "-";
	            }
	        }, {
	            // HLS回放 idx: 10
	            orderDataType: "dom-error-number",
	            type: "numeric",
	            data: "14.log_list",
	            render: function render(data, type, row, meta) {
	                if (data) {
	                    return _genList(row["14"], row["streamid"], "14", template);
	                } else return "-";
	            }
	        }, {
	            // 移动 idx: 11
	            orderDataType: "dom-collect-number",
	            type: "numeric",
	            data: "baduser.mobile_cdn",
	            render: function render(data, type, row, meta) {
	                if (data) {
	                    return _genCollect(row, "mobile_cdn", "6", templateCollect);
	                } else return "-";
	            }
	        }, {
	            // Flash idx: 12
	            orderDataType: "dom-collect-number",
	            type: "numeric",
	            data: "baduser.flash_cdn",
	            render: function render(data, type, row, meta) {
	                if (data) {
	                    return _genCollect(row, "flash_cdn", "7", templateCollect);
	                } else return "-";
	            }
	        }, {
	            // 卡顿用户数 idx: 13
	            orderDataType: "dom-user-number",
	            type: "numeric",
	            data: "baduser.user",
	            render: function render(data, type, row, meta) {
	                var dom = ["<a class='vh-summery-count-each vh-block' data-id='", row["streamid"], "' href='###'>", data, "</a>"];
	                return dom.join("");
	            }
	        }, {
	            // 用户总数 idx: 14
	            orderDataType: "dom-user-number",
	            type: "numeric",
	            data: "alluser.user",
	            render: function render(data, type, row, meta) {
	                var dom = ["<a class='vh-summery-count-each vh-block' data-id='", row["streamid"], "' href='###'>", data, "</a>"];
	                return dom.join("");
	            }
	        }]
	    });
	
	    // 表格事件
	    table.on('draw', function (e) {
	        monitor_table_event_list_details();
	        monitor_table_event_show_stream();
	    }).on('init', function () {
	        var tpl = _.template($("#tpl_table_toolbar").html());
	        var toolbar = $(".vh-table-toolbar").eq(0);
	        toolbar.html(tpl());
	
	        // 筛选按钮
	        toolbar.find(".ui.button.vh-tb-filter").on("click", function () {
	            _filter(table, false);
	        });
	
	        $('.ui.dropdown').dropdown();
	
	        // 倒计时
	        var countdown = toolbar.find(".vh-auto-reload-countdown");
	
	        // 自动刷新
	        toolbar.find(".ui.checkbox").checkbox({
	            onChecked: function onChecked() {
	                reloadInterval = setInterval(function () {
	                    table.ajax.reload();
	                }, _constant.Constant.reloadInterval);
	
	                countDownInterval = setInterval(function () {
	                    var n = countdown.html() - 1;
	                    if (n === 0) {
	                        n = _constant.Constant.reloadInterval / 1000;
	                    }
	                    countdown.html(n);
	                }, 1000);
	            },
	            onUnchecked: function onUnchecked() {
	                clearInterval(reloadInterval);
	                reloadInterval = undefined;
	
	                clearInterval(countDownInterval);
	                countDownInterval = undefined;
	                countdown.html(_constant.Constant.reloadInterval / 1000);
	            }
	        });
	
	        // 手动刷新
	        toolbar.find(".vh-tb-reload").on("click", function () {
	            table.ajax.reload();
	        });
	
	        // 快捷筛选
	        toolbar.find(".ui.idea").popup({
	            position: "bottom right",
	            offset: 5,
	            hoverable: true
	        });
	
	        toolbar.find(".vh-tb-shortcut").on("click", "a", function (e) {
	            var target = $(e.currentTarget);
	            var id = target.attr("data-id");
	            switch (id) {
	                case "1":
	                    // 过滤结束流
	                    table.column(11).order("desc"); // 按<移动>列降序排列
	                    _setFilter(5, "text", 5, "结束");
	                    _filter(table, true); // 组合查询
	                    break;
	                case "2":
	                    // 流ID大于10的
	                    _setFilter("0", "length", 3, 10);
	                    _filter(table, true); // 组合查询
	                    break;
	                default:
	                    break;
	            }
	        });
	
	        // 取消筛选
	        toolbar.find("button.vh-tb-filter-cancel").on("click", function () {
	            $.fn.dataTable.ext.search.length = 0;
	            _resetFilter();
	            table.draw();
	        });
	    });
	}
	
	/**
	 *  toolbar筛选条件
	 *  @param {object} table 控件
	 *  @param {boolean} isMultiple 是否多重查询
	  * @private
	 */
	function _filter(table, isMultiple) {
	    var search = $.fn.dataTable.ext.search;
	
	    // 多重查询
	    !isMultiple && _default();
	
	    var filters = _getFilter();
	    if (filters) {
	        $(filters).each(function (idx, item) {
	            var col = parseInt(item.col, 10),
	                dimension = item.dimension,
	                oper = parseInt(item.oper, 10),
	                val = item.val;
	            var func;
	
	            switch (col) {
	                case 0:
	                    // 流ID
	                    if (dimension === "length") {
	                        // 长度
	                        switch (oper) {
	                            case 1:
	                                // <=
	                                func = function func(settings, searchData, index, rowData, counter) {
	                                    return searchData[col].length <= parseInt(val, 10);
	                                };
	                                break;
	                            case 2:
	                                // ==
	                                func = function func(settings, searchData, index, rowData, counter) {
	                                    return searchData[col].length == parseInt(val, 10);
	                                };
	                                break;
	                            case 3:
	                                // >=
	                                func = function func(settings, searchData, index, rowData, counter) {
	                                    return searchData[col].length >= parseInt(val, 10);
	                                };
	                                break;
	                            default:
	                                _default();
	                        }
	                    } else if (dimension === "number") {
	                        // 大小
	                        _default();
	                    } else if (dimension === "text") {
	                        // 文本
	                        switch (oper) {
	                            case 4:
	                                // 包含
	                                func = function func(settings, searchData, index, rowData, counter) {
	                                    return searchData[col].indexOf(val) !== -1;
	                                };
	                                break;
	                            case 5:
	                                // 不包含
	                                func = function func(settings, searchData, index, rowData, counter) {
	                                    return searchData[col].indexOf(val) === -1;
	                                };
	                                break;
	                            case 1:case 2:case 3:default:
	                                _default();
	                        }
	                    }
	                    break;
	
	                case 4: // 移动发起
	                case 5: // SRS接收
	                case 6: // SRS分发
	                case 7: // 多码流转码
	                case 8: // HLS切片
	                case 9: // HLS同步
	                case 10:
	                    // HLS回放
	                    if (dimension === "number") {
	                        switch (oper) {
	                            case 1: // <=
	                            case 2: // ==
	                            case 3:
	                                // >=
	                                func = function func(settings, searchData, index, rowData, counter) {
	                                    var s = searchData[col];
	                                    var reg = /<span class="vh-td-error-number">(\d+)<\/span>/;
	                                    var match = reg.exec(s);
	                                    if (match) {
	                                        return _compare(parseInt(match[1], 10), parseInt(val, 10), oper);
	                                    }
	                                    return false;
	                                };
	                                break;
	                            default:
	                                _default();
	                        }
	                    } else if (dimension === "text") {
	                        switch (oper) {
	                            case 4:
	                                // 包含
	                                func = function func(settings, searchData, index, rowData, counter) {
	                                    var s = searchData[col];
	                                    return s.indexOf(val) !== -1;
	                                };
	                                break;
	                            case 5:
	                                // 不包含
	                                func = function func(settings, searchData, index, rowData, counter) {
	                                    var s = searchData[col];
	                                    return s.indexOf(val) === -1;
	                                };
	                                break;
	                            default:
	                                _default();
	                        }
	                    } else {
	                        _default();
	                    }
	                    break;
	
	                case 13: // 卡顿用户数
	                case 14:
	                    // 用户总数
	                    if (dimension === "number") {
	                        switch (oper) {
	                            case 1: // <=
	                            case 2: // ==
	                            case 3:
	                                // >=
	                                func = function func(settings, searchData, index, rowData, counter) {
	                                    var s = searchData[col];
	                                    var v = _tool.Tool.stripHTML(s);
	                                    return _compare(parseInt(v, 10), parseInt(val, 10), oper);
	                                };
	                                break;
	                            default:
	                                _default();
	                                break;
	                        }
	                    } else {
	                        _default();
	                    }
	                    break;
	
	                default:
	                    _default();
	            }
	
	            func && search.push(func);
	        });
	    } else {
	        _default();
	    }
	
	    table.draw();
	
	    function _default() {
	        search.length = 0;
	    }
	
	    function _compare(n1, n2, oper) {
	        switch (oper) {
	            case 1:
	                return n1 <= n2;
	                break;
	            case 2:
	                return n1 == n2;
	                break;
	            case 3:
	                return n1 >= n2;
	                break;
	        }
	    }
	}
	
	/**
	 *  解析toolbar中的筛选条件
	 * @returns {*[]} 无筛选条件  {array} 一个或多个条件
	 * @private
	 */
	function _getFilter() {
	    var toolbar = $(".vh-table-toolbar").eq(0);
	    // 列 vh-tb-col
	    var col = toolbar.find(".ui.dropdown.vh-tb-col").dropdown("get value");
	    if (col && col.length === 0) {
	        return null;
	    }
	
	    // 维度 vh-tb-dimension
	    var dimension = toolbar.find(".ui.dropdown.vh-tb-dimension").dropdown("get value");
	    if (dimension && dimension.length === 0) {
	        return null;
	    }
	
	    // 操作 vh-tb-oper
	    var oper = toolbar.find(".ui.dropdown.vh-tb-oper").dropdown("get value");
	    if (oper && oper.length === 0) {
	        return null;
	    }
	
	    // 值 vh-tb-val
	    var val = toolbar.find(".ui.input.vh-tb-val input").val().trim();
	    if (val == "") {
	        return null;
	    }
	
	    return [{
	        col: col,
	        dimension: dimension,
	        oper: oper,
	        val: val
	    }];
	}
	
	/**
	 *  设置toolbar中的筛选条件
	 * @param col
	 * @param dimension
	 * @param oper
	 * @param val
	 * @private
	 */
	function _setFilter(col, dimension, oper, val) {
	    var toolbar = $(".vh-table-toolbar").eq(0);
	    // 列 vh-tb-col
	    toolbar.find(".ui.dropdown.vh-tb-col").dropdown("set selected", col);
	
	    // 维度 vh-tb-dimension
	    toolbar.find(".ui.dropdown.vh-tb-dimension").dropdown("set selected", dimension);
	
	    // 操作 vh-tb-oper
	    toolbar.find(".ui.dropdown.vh-tb-oper").dropdown("set selected", oper);
	
	    // 值 vh-tb-val
	    toolbar.find(".ui.input.vh-tb-val input").val(val);
	}
	
	function _resetFilter() {
	    var toolbar = $(".vh-table-toolbar").eq(0);
	    // 列 vh-tb-col
	    toolbar.find(".ui.dropdown.vh-tb-col").dropdown("restore defaults");
	
	    // 维度 vh-tb-dimension
	    toolbar.find(".ui.dropdown.vh-tb-dimension").dropdown("restore defaults");
	
	    // 操作 vh-tb-oper
	    toolbar.find(".ui.dropdown.vh-tb-oper").dropdown("restore defaults");
	
	    // 值 vh-tb-val
	    toolbar.find(".ui.input.vh-tb-val input").val("");
	}
	
	/**
	 * 生成模版(id="tpl_td_list") 并向 streamData中填入数据
	 * @param data  {Array}    每一个单元格td的数据 如: 直播助手
	 * @param streamID {String}  作为key的streamID
	 * @param k  {String}       模块编号
	 * @param tpl  {function}   模版方法
	 * @returns {string}  返回生成的模版
	 * @private
	 */
	function _genList(data, streamID, k, tpl) {
	    if (data["log_list"].length > 0) {
	        if (!(streamID in streamData)) {
	            streamData[streamID] = {};
	        }
	
	        streamData[streamID][k] = data;
	
	        var arr = [];
	
	        $.each(data["log_list"], function (idx, item) {
	            var o = {};
	            data["log_list"][idx]["code"] = o["code"] = item.code; // 记录code
	            data["log_list"][idx]["desc"] = o["desc"] = _tool.Tool.getMessage(item.code); // 记录描述文字
	            data["log_list"][idx]["date"] = o["date"] = new Date(item.timestamp.$date).toISOString().replace("T", " "); // 记录格式化时间
	            data["log_list"][idx]["level"] = o["level"] = item.type; // 记录level
	            data["log_list"][idx]["bg"] = o["bg"] = _constant.Constant.level[item.type]; // 记录bg
	            arr.push(o);
	        });
	
	        return tpl({
	            row1: arr[0],
	            row2: arr[1],
	            row3: arr[2],
	            errorNum: data["error_no"],
	            id: streamID,
	            k: k
	        });
	    } else {
	        return "-";
	    }
	}
	
	/**
	 *
	 * @param data  一行数据
	 * @param type  类型
	 * @param k     模块编号
	 * @param tpl   模版方法
	 * @private
	 */
	function _genCollect(data, type, k, tpl) {
	    if (data["alluser"]["user"] > 0) {
	        var streamID = data["streamid"];
	        if (!(streamID in streamData)) {
	            streamData[streamID] = {};
	        }
	
	        streamData[streamID][k] = data;
	
	        var bad = data["baduser"][type];
	        var all = data["alluser"][type];
	        var arr = [];
	        var sum = 0,
	            total = 0;
	        $.each(all, function (k, v) {
	            var o = {};
	            o[k] = (bad[k] || 0) + "/" + v;
	            arr.push(o);
	            sum += bad[k] || 0;
	            total += v;
	        });
	
	        if (total === 0) {
	            // 没有错误的情况
	            $.each(all, function (k, v) {
	                total += v;
	                var o = {};
	                o[k] = 0 + "/" + v;
	                arr.push(o);
	            });
	        }
	
	        if (total === 0) {
	            // 还为0
	            return "-";
	        }
	
	        return tpl({
	            sum: sum,
	            total: total,
	            items: arr.slice(0, 3),
	            itemsRest: arr.length > 3 ? arr.slice(3) : [],
	            id: streamID,
	            k: k,
	            type: type,
	            more: arr.length > 3
	        });
	    } else {
	        return "-";
	    }
	}
	
	function monitor_table_event() {
	    // 历史 操作 点击事件
	    $(document).on("click", ".link.icon.vh-tb-list-oper", function () {
	        var that = $(this);
	        var code = that.attr("data-code"),
	            id = that.attr("data-id"),
	            host = that.attr("data-host"),
	            k = that.attr("data-k");
	        var template;
	        var grid = that.parents(".ui.grid");
	        if (that.hasClass("history")) {
	            // 历史
	            var url = _constant.Constant.url.monitor_stream_query_list_history.replace("{id}", id).replace("{host}", host).replace("{code}", code);
	            _tool.Tool.xhr_get(url, function (data, textStatus, jqXHR) {
	                var axis = [],
	                    all = [],
	                    host = [],
	                    stream = [];
	                $.each(data, function (k, v) {
	                    axis.push(k);
	                    all.push(v["all"]);
	                    host.push(v["host"]);
	                    stream.push(v["stream"]);
	                });
	
	                template = _.template($("#tpl_modal_history").html());
	                var html = template({
	                    errorCode: code,
	                    num: axis.length
	                });
	                grid.find(".vh-error-list-oper-box").html(html);
	                var graph = grid.find(".vh-history-graph");
	                monitor_table_graph(graph[0], axis, all, host, stream);
	            }, null);
	        } else {
	            // 操作
	            template = _.template($("#tpl_modal_oper").html());
	            var html = template({
	                errorCode: code,
	                needHandle: code,
	                reason: code,
	                method: code
	            });
	            grid.find(".vh-error-list-oper-box").html(html);
	        }
	        grid.find(".item").removeClass("current-bg");
	        that.parents(".item").eq(1).addClass("current-bg"); // 上边第二个 eq(1)
	    });
	}
	
	/**
	 *  点击每个绿红td 弹出对话框
	 */
	function monitor_table_event_list_details() {
	    var td = $("table.ui.table").find(".vh-error-list");
	    var template = _.template($("#tpl_modal_list").html());
	
	    td.off("click").on("click", function (e) {
	        var that = $(e.currentTarget);
	        var selector = ".vh-modal-list-details";
	
	        $(selector + ".ui.modal").modal({
	            closable: true,
	            onShow: function onShow() {
	                var id = that.attr("data-id");
	                var k = that.attr("data-k");
	                var n = _constant.Constant.queryNumber + "";
	                if (id) {
	                    var url = _constant.Constant.url.monitor_stream_query_list.replace("{id}", id).replace("{k}", k).replace("{len}", n);
	                    _tool.Tool.xhr_get(url, function (data, textStatus, jqXHR) {
	                        $.each(data, function (idx, obj) {
	                            // parse base64
	                            //if ("_m" in obj["attr"]) {
	                            //obj["attr"]["_m"] = T.base64.decode(obj["attr"]["_m"]);
	                            //}
	
	                            data[idx]["desc"] = _tool.Tool.getMessage(obj.code); // 记录描述文字
	                            data[idx]["date"] = new Date(obj.timestamp.$date).toISOString().replace("T", " "); // 记录格式化时间
	                            data[idx]["level"] = obj.type; // 记录level
	                            data[idx]["bg"] = _constant.Constant.level[obj.type]; // 记录bg
	                        });
	
	                        $(selector).find(".vh-error-list-box").html(template({
	                            items: data,
	                            id: id,
	                            k: k
	                        }));
	
	                        $(selector).find(".vh-error-list-oper-box").empty();
	
	                        $(selector).find(".ui.checkbox").checkbox({
	                            onChecked: function onChecked() {
	                                $(selector).find(".vh-error-list-box").find(".success").parents(".item").hide();
	                                $(selector).find(".vh-should-view")[0].scrollIntoView();
	                            },
	                            onUnchecked: function onUnchecked() {
	                                $(selector).find(".vh-error-list-box").find(".success").parents(".item").show();
	                                $(selector).find(".vh-should-view")[0].scrollIntoView();
	                            }
	                        });
	
	                        // 隐藏 显示后 选择的显示在屏幕中
	                        $(selector).find(".vh-error-list-box").on("click", ".item", function (e) {
	                            var items = $(selector).find(".vh-error-list-box").find(".item");
	                            items.removeClass("vh-should-view");
	
	                            $(e.currentTarget).addClass("vh-should-view");
	                        });
	                    }, null);
	                } else {
	                    return false; // 没有streamID 不显示列表
	                }
	            }
	        }).modal('setting', 'transition', "browse").modal('show').modal("refresh");
	    });
	}
	
	/**
	 *  点击每个灰色的td中的list 弹出视频窗口
	 */
	function monitor_table_event_show_stream() {
	    // more...
	    $('.ui.accordion').accordion({
	        selector: {
	            trigger: '.title.vh-more'
	        }
	    });
	
	    var td = $("table.ui.table").find(".vh-error-collect");
	
	    // 弹出视频窗口
	    td.off("click").on("click", ".item", function (e) {
	        var that = $(e.currentTarget);
	        var _td = that.parents(".vh-error-collect");
	        var id = _td.attr("data-id");
	        var k = _td.attr("data-k");
	        var type = _td.attr("data-type");
	
	        var domain = that.text().split(":")[0].trim();
	        var url, hash;
	
	        domain = domain.replace(/_wap/g, ""); // 去掉所有_wap
	
	        if (domain.indexOf("rtmp") !== -1) {
	            // rtmp
	            // 格式: rtmp://domain/vhall/id
	            hash = ["rtmp://", domain, "/vhall/", id];
	            url = './player/srs.html#' + hash.join("");
	        } else if (domain.indexOf("hls") !== -1) {
	            // hls
	            // 格式: http://cn_domain/vhall/id/livestream.m3u8
	            // 格式: http://cc_domain/vhall/id/index.m3u8
	            // 格式: http://xyhlslivepc/vhall/id/livestream.m3u8
	            var suffix = domain.startsWith("cc") ? "/index.m3u8" : "/livestream.m3u8";
	            hash = ["http://", domain, "/vhall/", id, suffix];
	            url = './player/jwp.html#' + hash.join("");
	        } else {
	            return;
	        }
	
	        $(".ui.modal.vh-modal-player").modal({
	            closable: true,
	            onShow: function onShow() {
	                $('.ui.embed').embed({
	                    url: encodeURI(url)
	                });
	            },
	            onHide: function onHide() {
	                var ifr = $("iframe")[0];
	                ifr.contentWindow.player_stop();
	                $('.ui.embed').find(".embed").remove();
	            }
	        }).modal('setting', 'transition', "fly down").modal('show').modal("refresh");
	    });
	
	    // 汇总
	    $("table.ui.table td").off("click").on("click", ".vh-summery-count-each", function (e) {
	        var that = $(e.currentTarget);
	        var _td = that.parents(".vh-error-collect");
	        if (_td.length === 0) {
	            _td = that;
	        }
	        var id = _td.attr("data-id");
	        var type = _td.attr("data-type") || "total"; // flash h5 ...
	
	        $(".ui.modal.vh-modal-summery-count").modal({
	            closable: true,
	            onShow: function onShow() {
	                var url = _constant.Constant.url.monitor_stream_summery_count.replace("{id}", id);
	                _tool.Tool.xhr_get(url, function (data, textStatus, jqXHR) {
	                    var times = [],
	                        legend = [],
	                        series = [],
	                        series_quality = [];
	                    var app = [],
	                        flash = [],
	                        h5 = [],
	                        app_quality = [],
	                        flash_quality = [],
	                        h5_quality = [],
	                        each = {},
	                        each_bad = {},
	                        each_quality = {},
	                        // 当不是全部时 存储各个分流的数据 如 "cnrtmplive02.e.vhall.com": 2
	                    sum = 0,
	                        sum_bad;
	
	                    var mobile_cdn = [],
	                        flash_cdn = [],
	                        h5_cdn = [];
	
	                    // 取得所有分类的名称
	                    $.each(data, function (k, v) {
	                        var key = _.keys(v)[0]; // 时间
	                        var cur = v[key]["alluser"];
	
	                        $.each(cur["mobile_cdn"], function (i, j) {
	                            if (_.indexOf(mobile_cdn, i) === -1) {
	                                mobile_cdn.push(i);
	                            }
	                        });
	
	                        $.each(cur["flash_cdn"], function (i, j) {
	                            if (_.indexOf(flash_cdn, i) === -1) {
	                                flash_cdn.push(i);
	                            }
	                        });
	
	                        $.each(cur["h5_cdn"], function (i, j) {
	                            if (_.indexOf(h5_cdn, i) === -1) {
	                                h5_cdn.push(i);
	                            }
	                        });
	                    });
	
	                    $.each(data, function (k, v) {
	                        var key = _.keys(v)[0]; // 时间
	                        times.push(key);
	
	                        var cur = v[key]; // 当前对象 如 "14:15:16": {"alluser":{}, "baduser":{}}
	                        var alluser = cur["alluser"];
	                        var baduser = cur["baduser"];
	
	                        if (type === "total") {
	                            sum = 0;
	                            sum_bad = 0;
	                            $.each(alluser["mobile_cdn"], function (i, j) {
	                                sum += j;
	                            });
	                            app.push(sum);
	
	                            $.each(baduser["mobile_cdn"], function (i, j) {
	                                sum_bad += j;
	                            });
	                            app_quality.push(_formula(sum, sum_bad));
	
	                            sum = 0;
	                            sum_bad = 0;
	                            $.each(alluser["flash_cdn"], function (i, j) {
	                                sum += j;
	                            });
	                            flash.push(sum);
	
	                            $.each(baduser["flash_cdn"], function (i, j) {
	                                sum_bad += j;
	                            });
	                            flash_quality.push(_formula(sum, sum_bad));
	
	                            sum = 0;
	                            sum_bad = 0;
	                            // h5 暂时没有数据
	                            h5.push(0);
	                            h5_quality.push(0);
	                        } else {
	                            // 格式: each{"cnrtmplive02.e.vhall.com": [2, 4, 6], ...}
	                            var obj;
	                            if (type === "mobile_cdn") {
	                                obj = mobile_cdn;
	                            } else if (type === "flash_cdn") {
	                                obj = flash_cdn;
	                            } else if (type === "h5_cdn") {
	                                obj = h5_cdn;
	                            }
	                            $.each(obj, function (i, elem) {
	                                if (!(elem in each)) {
	                                    each[elem] = [];
	                                }
	
	                                if (alluser[type]) {
	                                    each[elem].push(alluser[type][elem] || 0);
	                                } else {
	                                    each[elem].push(0);
	                                }
	                            });
	
	                            $.each(obj, function (i, elem) {
	                                if (!(elem in each_bad)) {
	                                    each_bad[elem] = [];
	                                }
	                                if (baduser[type]) {
	                                    each_bad[elem].push(baduser[type][elem] || 0);
	                                } else {
	                                    each_bad[elem].push(0);
	                                }
	                            });
	                        }
	                    });
	
	                    if (type === "total") {
	                        legend = ["app", "flash", "h5"];
	
	                        $([app, flash, h5]).each(function (i, d) {
	                            series.push({
	                                name: legend[i],
	                                type: "bar",
	                                stack: '总量',
	                                data: d
	                            });
	                        });
	
	                        $([app_quality, flash_quality, h5_quality]).each(function (i, d) {
	                            series_quality.push({
	                                name: legend[i],
	                                type: "line",
	                                data: d
	                            });
	                        });
	                    } else {
	                        legend = _.keys(each);
	
	                        $.each(legend, function (i, o) {
	                            series.push({
	                                name: legend[i],
	                                type: "bar",
	                                stack: '总量',
	                                data: each[o]
	                            });
	                        });
	
	                        $.each(each, function (k, v) {
	                            // {"cnrtmplive02.e.vhall.com": [2, 4, 6]}
	                            each_quality[k] = [];
	                            $.each(v, function (i, j) {
	                                // 如: [2, 4, 6]
	                                each_bad[k] && each_quality[k].push(_formula(j, each_bad[k][i]));
	                            });
	                        });
	
	                        $.each(legend, function (i, o) {
	                            series_quality.push({
	                                name: legend[i],
	                                type: "line",
	                                data: each_quality[o]
	                            });
	                        });
	                    }
	
	                    var template = _.template($("#tpl_modal_summery_count").html());
	                    var html = template({
	                        num: times.length
	                    });
	                    var box = $(".ui.modal.vh-modal-summery-count");
	                    box.find(".content").html(html);
	
	                    var graph = box.find(".vh-summery-count-graph-statistics");
	                    monitor_summery_count_graph_statistics(graph[0], times, legend, series);
	
	                    graph = box.find(".vh-summery-count-graph-quality");
	                    monitor_summery_count_graph_quality(graph[0], times, legend, series_quality);
	                }, null);
	            }
	        }).modal('setting', 'transition', "slide up").modal('show').modal("refresh");
	    });
	}
	
	function _formula(total, bad) {
	    if (total === bad) {
	        return 0;
	    }
	    var n = ((total - bad) / total * 100).toFixed(2);
	    return n < 0 ? 0 : n;
	}
	
	function monitor_table_graph(dom, axis, all, host, stream) {
	    var myChart = E.init(dom);
	
	    // 指定图表的配置项和数据
	    var option = {
	        tooltip: {
	            trigger: 'axis'
	        },
	        legend: {
	            data: ['活动', '本机', '全部']
	        },
	        grid: {
	            left: '3%',
	            right: '4%',
	            bottom: '3%',
	            containLabel: true
	        },
	        xAxis: {
	            type: 'category',
	            boundaryGap: false,
	            data: axis
	        },
	        yAxis: {
	            type: 'value',
	            minInterval: 1
	        },
	        series: [{
	            name: "活动",
	            type: "line",
	            data: stream
	        }, {
	            name: "本机",
	            type: "line",
	            data: host
	        }, {
	            name: "全部",
	            type: "line",
	            data: all
	        }]
	    };
	
	    // 使用刚指定的配置项和数据显示图表。
	    myChart.setOption(option);
	}
	
	/**
	 * 汇总统计图
	 * @param dom
	 * @param axis
	 * @param legend
	 * @param series
	 */
	function monitor_summery_count_graph_statistics(dom, axis, legend, series) {
	    var myChart = E.init(dom);
	
	    var option = {
	        tooltip: {
	            trigger: 'axis',
	            axisPointer: {
	                type: 'shadow'
	            }
	        },
	        legend: {
	            data: legend,
	            x: 'right'
	        },
	        dataZoom: [{
	            show: true,
	            realtime: true,
	            start: 0,
	            end: 100,
	            xAxisIndex: 0,
	            bottom: 0
	        }],
	        grid: [{
	            left: '20',
	            right: '40',
	            bottom: '50',
	            containLabel: true
	        }],
	        xAxis: [{
	            type: 'category',
	            boundaryGap: true,
	            axisLine: { onZero: true },
	            name: "时间",
	            axisLabel: {
	                rotate: -30
	            },
	            data: axis
	        }],
	        yAxis: [{
	            name: '个数',
	            type: 'value'
	        }],
	        series: series
	    };
	
	    myChart.setOption(option);
	}
	
	function monitor_summery_count_graph_quality(dom, axis, legend, series) {
	    var myChart = E.init(dom);
	
	    var option = {
	        tooltip: {
	            trigger: 'axis',
	            axisPointer: {
	                type: 'shadow'
	            }
	        },
	        legend: {
	            data: legend,
	            x: 'right'
	        },
	        dataZoom: [{
	            show: true,
	            realtime: true,
	            start: 0,
	            end: 100,
	            xAxisIndex: 0,
	            bottom: 0
	        }],
	        grid: [{
	            left: '20',
	            right: '40',
	            bottom: '50',
	            containLabel: true
	        }],
	        xAxis: [{
	            type: 'category',
	            boundaryGap: true,
	            axisLine: { onZero: true },
	            name: "时间",
	            axisLabel: {
	                rotate: -30
	            },
	            data: axis
	        }],
	        yAxis: [{
	            name: '百分比',
	            //max: 110,
	            type: 'value'
	        }],
	        series: series
	    };
	
	    myChart.setOption(option);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },

/***/ 3:
/***/ function(module, exports) {

	/**
	 * Created by shen on 2016/7/14.
	 */
	
	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	        value: true
	});
	var host = "http://123.57.180.76:4588/";
	
	var Constant = exports.Constant = {
	        debug: false,
	
	        pages: {
	                stream: "monitor_stream.html",
	                error_stat: "monitor_error_stat.html",
	                log_search: "monitor_log_search.html"
	        },
	
	        message: {
	                '12001': '开始推流',
	                '12002': '停止推流',
	                '12003': '登录',
	                '12004': '退出',
	                '12005': '音频设置',
	                '12006': '视频设置',
	                '12007': '推流状态',
	                '12008': '主机配置信息',
	                '12009': '用户重连推流开始',
	                '14001': '无法连接到源节点',
	                '14002': '网络状况差',
	                '14003': '主机性能差',
	                '14004': '程序崩溃',
	
	                '20001': 'SRS启动',
	                '20002': 'SRS关闭',
	                '22101': 'rtmp推流开始',
	                '22102': 'rtmp推流结束',
	                '24101': 'rtmp推流失败-http调接口失败',
	                '24102': 'rtmp推流失败-token验证失败',
	                '24103': 'rtmp推流失败-token为空',
	                '24111': 'rtmp推流失败-数据无法识别',
	                '22201': 'rtmp PLAY成功',
	                '22202': 'rtmp PLAY结束',
	                '24203': 'rtmp PLAY失败',
	                '24204': 'rtmp PLAY时，出现shrink',
	                '22301': 'rtmp forward流开始',
	                '22302': 'rtmp forward流结束',
	                '24303': 'rtmp forward流，出现shrink',
	                '24304': 'rtmp forward流，连接失败，重试',
	                '22401': 'aac ffmpeg启动成功',
	                '22402': 'aac ffmpeg结束成功',
	                '24403': 'aac Encoder会话异常终止',
	                '24404': 'aac ffmpeg进程异常重启',
	                '24501': 'edge→core建立链路失败',
	                '24502': 'edge→core发送数据失败',
	                '24503': 'edge→core数据队列shrink',
	                '24901': '发起帧数不够，卡顿',
	
	                '52001': '推流开始',
	                '52002': '推流结束',
	                '52005': '推流心跳',
	                '54001': '推流卡顿',
	                '54003': '编码卡顿',
	                '54005': '推流失败',
	
	                '62001': '推流开始',
	                '62002': '推流结束',
	                '62003': '拉流开始',
	                '62004': '拉流结束',
	                '62005': '推流心跳',
	                '62006': '拉流心跳',
	                '64001': '推流卡顿',
	                '64002': '拉流卡顿',
	                '64003': '编码卡顿',
	                '64004': '解码卡顿',
	                '64005': '推流失败',
	                '64006': '拉流失败',
	
	                '72001': '开始',
	                '72002': '结束',
	                '72003': '心跳',
	                '74001': '卡顿',
	
	                '112000': 'srs分发服务心跳',
	                '112001': '开始分发任务',
	                '112002': '创建分发线程结束',
	                '112003': '创建HLS切片',
	                '112004': '创建转码任务',
	                '112005': '创建截图任务',
	                '114000': '分发任务服务模块',
	                '114001': '创建HLS切片',
	                '114002': '获取srs传来的参数出错',
	                '114003': '获取配置文件配置出错',
	                '114004': '分发服务创建HLS切片任务失败',
	                '114005': '分发服务创建转码任务失败',
	                '114006': '分发服务创建截图任务失败',
	                '114007': '调用web接口失败',
	
	                '122000': '切片服务心跳',
	                '122001': '创建HLS切片',
	                '122002': '开始HLS切片',
	                '122003': 'HLS切片中',
	                '122004': '切片心跳',
	                '122005': 'RTMP断开',
	                '122006': 'HLS切片完成',
	                '122007': '创建message文件',
	                '122008': '创建完成message文件',
	                '124000': 'worker模块错误',
	                '124001': '磁盘io错误',
	                '124002': 'mysql错误',
	                '124003': '添加gearman任务错误',
	                '124004': '获取rtmp流信息错误',
	                '124005': '连接rtmp流出错',
	                '124006': '切片目录监控出错',
	                '124007': '创建ppt信息文件出错',
	                '124008': '切片程序未知异常',
	                '124009': '解析从gearmand获取的切片参数异常',
	                '124010': '切片的rtmp流异常断开',
	                '124011': '调用web接口获取flash信息失败',
	                '124012': '调用web接口获取活动开始结束时间失败',
	                '124013': 'ts文件缺失',
	                '124014': 'tsinfo文件缺失',
	                '124015': '解析tsinfo文件异常',
	                '124016': '向gearmand放入同步任务出错',
	                '124017': '纯音频ts文件创建失败',
	                '124018': '纯音频ts文件创建超时',
	
	                '132000': '同步服务心跳',
	                '132001': '调用生成HLS回放',
	                '132002': '返回HLS回放生成完成',
	                '134000': '同步任务服务模块',
	                '134001': '同步文件中',
	                '134002': '调用生成回放失败',
	                '134003': '返回生成回放失败',
	                '134004': '解析从gearmand传来的参数出错',
	
	                '142000': '回放管理服务心跳',
	                '142001': '开始生成回放',
	                '142002': '回放生成中',
	                '142003': '回放生成完成',
	                '142004': '开始生成裁剪预览',
	                '142005': '预览生成中',
	                '142006': '裁剪预览完成',
	                '142007': '开始裁剪',
	                '142008': '裁剪生成中',
	                '142009': '裁剪完成',
	                '142010': '开始生成下载文件',
	                '142011': '下载文件生成中',
	                '142012': '下载文件生成完成',
	
	                '142101': '开始生成回放',
	                '142102': '回放生成中',
	                '142103': '回放生成完成',
	
	                '142201': '开始生成裁剪预览',
	                '142202': '预览生成中',
	                '142203': '裁剪预览完成',
	
	                '142301': '开始裁剪',
	                '142302': '裁剪生成中',
	                '142303': '裁剪完成',
	
	                '142401': '开始生成下载文件',
	                '142402': '下载文件生成中',
	                '142403': '下载文件生成完成',
	
	                '142501': '开始创建录播',
	                '142502': '录播生成中',
	                '142503': '录播生成完成',
	
	                '144000': '回放管理服务模块',
	                '144001': '创建回放磁盘io错误',
	                '144002': '创建回放活动未找到',
	                '144003': '创建回放mysql错误',
	                '144004': '创建回放调用web接口失败',
	                '144005': '创建回放程序异常',
	                '144020': '创建回放参数错误',
	                '144006': '创建裁剪预览磁盘io错误',
	                '144007': '创建裁剪预览时间段内活动未找到',
	                '144008': '创建裁剪预览mysql错误',
	                '144009': '创建裁剪预览调用web接口失败',
	                '144010': '创建裁剪预览程序异常',
	                '144021': '创建预览参数错误',
	                '144011': '创建裁剪磁盘io错误',
	                '144012': '创建裁剪时间段内活动未找到',
	                '144013': '创建裁剪mysql错误',
	                '144014': '创建裁剪调用web接口失败',
	                '144015': '创建裁剪程序异常',
	                '144022': '创建裁剪参数错误',
	                '144016': '创建下载文件磁盘io错误',
	                '144017': '创建下载指定时间内活动未找到',
	                '144018': '创建下载文件转码失败',
	                '144019': '创建下载文件程序异常',
	                '144023': '创建下载参数错误',
	
	                '144101': '创建回放磁盘io错误',
	                '144102': '没有找到创建回放的活动目录',
	                '144103': 'ts文件有缺失',
	                '144104': '创建回放调用web接口失败',
	                '144105': '执行过程中代码出现异常',
	                '144106': 'tsinfo读取失败',
	                '144120': '传入参数错误',
	
	                '144201': '创建裁剪预览磁盘io错误',
	                '144202': '没有找到预览时间段内的活动',
	                '144204': '创建裁剪预览调用web接口失败',
	                '144205': '执行过程中代码出现异常',
	                '144206': '获取的参数有误',
	                '144207': '读取tsinfo文件失败',
	                '144208': 'ts文件缺失',
	
	                '144301': '创建裁剪磁盘io错误',
	                '144302': '创建裁剪时间段内活动未找到',
	                '144303': '创建裁剪调用web接口失败',
	                '144304': '执行过程中代码出现异常',
	                '144305': '获取的参数有误',
	                '144306': '解析message文件异常',
	
	                '144401': '创建下载文件磁盘io错误',
	                '144402': '创建下载指定时间内活动未找到',
	                '144403': 'ts转码mp4失败',
	                '144404': '执行过程中代码出现异常',
	                '144405': '获取的参数有误',
	                '144406': '生成zip压缩包失败',
	                '144407': '调用web接口失败',
	
	                '144501': '创建目录或文件失败',
	                '144502': '创建录播程序IO错误',
	                '144503': '创建录播调用web接口失败',
	                '144504': '执行过程中代码出现异常',
	                '144505': 'tsinfo文件读取失败',
	                '144506': 'ts文件缺失',
	
	                '152000': '截图鉴黄服务心跳',
	                '152001': '发送截图url',
	
	                '154000': '截图鉴黄服务连接gearmand错误',
	
	                '162000': '转码服务心跳',
	                '162001': '从gearmand里获取转码任务',
	                '162002': '开始转码',
	                '162003': '转码任务心跳',
	                '162004': '转码结束',
	
	                '164000': '转码服务连接gearmand错误',
	                '164001': '转码服务异常',
	                '164002': '获取rtmp流信息错误',
	                '164003': 'rtmp流异常断开',
	                '164004': '调用web接口获取活动转码信息失败',
	                '164005': '获取转码参数错误',
	                '164006': '转码程序异常',
	
	                '202000': 'relay server服务心跳',
	                '202001': 'task manager服务心跳',
	                '202002': '推拉流服务启动',
	                '202003': '推拉流服务停止',
	                '202004': '推拉流服务重试',
	                '202005': '源流结束',
	                '204001': 'relay server连接redis失败',
	                '204002': 'task manager连接redis失败',
	                '204003': 'monitor exception',
	                '204004': 'bad request',
	                '204300': 'unkown error',
	                '204301': 'token error',
	                '204302': 'input or output connection failed',
	                '204303': 'input/output error',
	                '204304': 'file or directory not found',
	                '204306': 'operation failed',
	                '204307': 'ailed to resolve address',
	
	                '232101': '转换服务启动',
	                '232001': '成功收到任务',
	                '232011': '转换任务开始',
	                '232002': '转换任务完成',
	                '234001': '接收任务失败',
	                '234011': '转换任务失败'
	        },
	
	        tableLocale: {
	                "sProcessing": "处理中...",
	                "sLengthMenu": "显示 _MENU_ 项结果",
	                "sZeroRecords": "没有匹配结果",
	                "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
	                "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
	                "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
	                "sInfoPostFix": "",
	                "sSearch": "搜索:",
	                "sUrl": "",
	                "sEmptyTable": "没有数据",
	                "sLoadingRecords": "载入中...",
	                "sInfoThousands": ",",
	                "oPaginate": {
	                        "sFirst": "首页",
	                        "sPrevious": "上页",
	                        "sNext": "下页",
	                        "sLast": "末页"
	                },
	                "oAria": {
	                        "sSortAscending": ": 以升序排列此列",
	                        "sSortDescending": ": 以降序排列此列"
	                },
	                "sDecimal": ".",
	                "sThousands": ","
	        },
	
	        url: {
	                monitor_stream: host + "stream",
	                monitor_stream_query_list: host + "stream_mod_query?streamid={id}&mod={k}&length={len}",
	                monitor_stream_query_list_history: host + "stream_mod_code_query?streamid={id}&hostname={host}&code={code}",
	                monitor_stream_summery_count: host + "stream_user_count_query?streamid={id}",
	
	                monitor_host: host + "hosts",
	
	                monitor_error_stat_overview: host + "stream_error_count_query",
	                monitor_error_stat_host: host + "stream_host_error_count_query",
	                monitor_error_stat_oneday: host + "oneday_error_count_query",
	
	                monitor_log_search: host + "search?streamid={id}&hostname={host}&mod={mod}&code={code}&day={date}&timestart={start}&timeend={end}",
	                monitor_duplicate_stream: host + "stream_badpush",
	                monitor_gallery: host + "stream_photo",
	                monitor_online_users: host + "streaminfo",
	                monitor_doc_conversion: host + "get_doc",
	
	                monitor_get_streams: host + "get_stream",
	                monitor_get_hosts: host + "get_host"
	        },
	
	        level: {
	                "2": "success",
	                "4": "danger"
	        },
	
	        queryNumber: 100, // 查询错误列表结果个数
	
	        reloadInterval: 15000 // 表格自动刷新间隔时间
	
	        , modules: {
	                "20": "第三方",
	                "1": "助手",
	                "5": "移动发起",
	                "2": "srs",
	                "11": "srs分发",
	                "16": "多码流转码",
	                "12": "切片",
	                "13": "同步",
	                "14": "回放",
	                //~~
	                "23": "文档转换",
	                "15": "截图",
	                "6": "移动观看",
	                "7": "Flash观看端"
	        }
	};

/***/ },

/***/ 4:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 22:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 29:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 30:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 32:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Tool = undefined;
	
	var _constant = __webpack_require__(3);
	
	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; /**
	                                                                                             * Created by shen on 2016/7/14.
	                                                                                             */
	
	var base64DecodeChars = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];
	
	/**
	 * base64编码
	 * @param {Object} str
	 */
	function base64encode(str) {
	    var out, i, len;
	    var c1, c2, c3;
	    len = str.length;
	    i = 0;
	    out = "";
	    while (i < len) {
	        c1 = str.charCodeAt(i++) & 0xff;
	        if (i == len) {
	            out += base64EncodeChars.charAt(c1 >> 2);
	            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
	            out += "==";
	            break;
	        }
	        c2 = str.charCodeAt(i++);
	        if (i == len) {
	            out += base64EncodeChars.charAt(c1 >> 2);
	            out += base64EncodeChars.charAt((c1 & 0x3) << 4 | (c2 & 0xF0) >> 4);
	            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
	            out += "=";
	            break;
	        }
	        c3 = str.charCodeAt(i++);
	        out += base64EncodeChars.charAt(c1 >> 2);
	        out += base64EncodeChars.charAt((c1 & 0x3) << 4 | (c2 & 0xF0) >> 4);
	        out += base64EncodeChars.charAt((c2 & 0xF) << 2 | (c3 & 0xC0) >> 6);
	        out += base64EncodeChars.charAt(c3 & 0x3F);
	    }
	    return out;
	}
	
	/**
	 * base64解码
	 * @param {Object} str
	 */
	function base64decode(str) {
	    var c1, c2, c3, c4;
	    var i, len, out;
	    len = str.length;
	    i = 0;
	    out = "";
	    while (i < len) {
	        /* c1 */
	        do {
	            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
	        } while (i < len && c1 == -1);
	        if (c1 == -1) break;
	        /* c2 */
	        do {
	            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
	        } while (i < len && c2 == -1);
	        if (c2 == -1) break;
	        out += String.fromCharCode(c1 << 2 | (c2 & 0x30) >> 4);
	        /* c3 */
	        do {
	            c3 = str.charCodeAt(i++) & 0xff;
	            if (c3 == 61) return out;
	            c3 = base64DecodeChars[c3];
	        } while (i < len && c3 == -1);
	        if (c3 == -1) break;
	        out += String.fromCharCode((c2 & 0XF) << 4 | (c3 & 0x3C) >> 2);
	        /* c4 */
	        do {
	            c4 = str.charCodeAt(i++) & 0xff;
	            if (c4 == 61) return out;
	            c4 = base64DecodeChars[c4];
	        } while (i < len && c4 == -1);
	        if (c4 == -1) break;
	        out += String.fromCharCode((c3 & 0x03) << 6 | c4);
	    }
	    return out;
	}
	
	/**
	 * utf16转utf8
	 * @param {Object} str
	 */
	function utf16to8(str) {
	    var out, i, len, c;
	    out = "";
	    len = str.length;
	    for (i = 0; i < len; i++) {
	        c = str.charCodeAt(i);
	        if (c >= 0x0001 && c <= 0x007F) {
	            out += str.charAt(i);
	        } else if (c > 0x07FF) {
	            out += String.fromCharCode(0xE0 | c >> 12 & 0x0F);
	            out += String.fromCharCode(0x80 | c >> 6 & 0x3F);
	            out += String.fromCharCode(0x80 | c >> 0 & 0x3F);
	        } else {
	            out += String.fromCharCode(0xC0 | c >> 6 & 0x1F);
	            out += String.fromCharCode(0x80 | c >> 0 & 0x3F);
	        }
	    }
	    return out;
	}
	
	/**
	 * utf8转utf16
	 * @param {Object} str
	 */
	function utf8to16(str) {
	    var out, i, len, c;
	    var char2, char3;
	    out = "";
	    len = str.length;
	    i = 0;
	    while (i < len) {
	        c = str.charCodeAt(i++);
	        switch (c >> 4) {
	            case 0:
	            case 1:
	            case 2:
	            case 3:
	            case 4:
	            case 5:
	            case 6:
	            case 7:
	                // 0xxxxxxx
	                out += str.charAt(i - 1);
	                break;
	            case 12:
	            case 13:
	                // 110x xxxx 10xx xxxx
	                char2 = str.charCodeAt(i++);
	                out += String.fromCharCode((c & 0x1F) << 6 | char2 & 0x3F);
	                break;
	            case 14:
	                // 1110 xxxx10xx xxxx10xx xxxx
	                char2 = str.charCodeAt(i++);
	                char3 = str.charCodeAt(i++);
	                out += String.fromCharCode((c & 0x0F) << 12 | (char2 & 0x3F) << 6 | (char3 & 0x3F) << 0);
	                break;
	        }
	    }
	    return out;
	}
	
	/**
	 * 随机得到指定范围中的一个数字 包括这个范围本身
	 * @param start
	 * @param end
	 * @returns {number}
	 */
	function random(start, end) {
	    var n = end - start + 1;
	    return Math.floor(Math.random() * n + start);
	}
	
	/**
	 * 去除str中的HTML标签 返回纯文本
	 * @param str HTML文本
	 * @returns {string}
	 */
	function stripHTML(str) {
	    var reg = /<(?:.|\s)*?>/g;
	    return str.replace(reg, "");
	}
	
	function getUrlParam(name, str) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	    var r = str.match(reg);
	    if (r != null) return decodeURI(r[2]);
	    return null;
	}
	
	function dateFormat(date, fmt) {
	    var o = {
	        "M+": date.getMonth() + 1, //月份
	        "d+": date.getDate(), //日
	        "h+": date.getHours(), //小时
	        "m+": date.getMinutes(), //分
	        "s+": date.getSeconds(), //秒
	        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
	        "S": date.getMilliseconds() //毫秒
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o) {
	        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
	    }return fmt;
	}
	
	var Tool = exports.Tool = {
	    xhr_get: function xhr_get(url, done, fail) {
	        return $.ajax({
	            type: "GET",
	            url: url,
	            dataType: "json"
	            //,data: JSON.stringify(query),
	            //contentType: "application/json"
	        }).done(function (data, textStatus, jqXHR) {
	            done(data, textStatus, jqXHR);
	        }).fail(function (jqXHR, textStatus, errorThrown) {
	            fail && fail(jqXHR, textStatus, errorThrown);
	        });
	    },
	
	    xhr_post: function xhr_post(url, data, done, fail) {
	        return $.ajax({
	            type: "POST",
	            url: url,
	            dataType: "json",
	            data: JSON.stringify(data)
	        }).done(function (data, textStatus, jqXHR) {
	            done(data, textStatus, jqXHR);
	        }).fail(function (jqXHR, textStatus, errorThrown) {
	            fail && fail(jqXHR, textStatus, errorThrown);
	        });
	    },
	
	    /*
	     * 初始化Message module
	     */
	    initMessage: function initMessage() {},
	
	    getMessage: function getMessage(key) {
	        return _constant.Constant.message[key];
	    },
	
	    getMessages: function getMessages() {
	        return _constant.Constant.message;
	    },
	
	    getModule: function getModule(key) {
	        return _constant.Constant.modules[key];
	    },
	
	    getModules: function getModules() {
	        return _constant.Constant.modules;
	    },
	
	    stripHTML: stripHTML,
	
	    random: random,
	
	    urlParam: getUrlParam,
	
	    dateFormat: dateFormat,
	
	    base64: {
	        encode: function encode(value) {
	            return base64encode(utf16to8(value));
	        },
	
	        decode: function decode(value) {
	            return utf8to16(base64decode(value));
	        }
	    }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }

});
//# sourceMappingURL=monitor_stream.js.map