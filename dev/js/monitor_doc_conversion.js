webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _constant = __webpack_require__(3);
	
	/**
	 * Created by shen on 2016/7/18.
	 */
	
	__webpack_require__(4);
	__webpack_require__(22);
	__webpack_require__(29);
	__webpack_require__(30);
	
	__webpack_require__(31);
	
	//var _ = require('lodash');
	
	//import {Tool} from './tool';
	
	$(function () {
	    monitor_doc_conversion_table();
	});
	
	/**
	 * 生成table数据
	 */
	function monitor_doc_conversion_table() {
	    var url = _constant.Constant.url.monitor_doc_conversion;
	
	    var $table = $("table.ui.table");
	
	    if ($.fn.dataTable.tables().length) {
	        // 如果第二次 只改变url值
	        $.fn.dataTable.tables({ api: true }).ajax.url(url).load();
	    } else {
	        var table = $table.DataTable({
	            destroy: true,
	            "dom": 'iftlp',
	            "language": _constant.Constant.tableLocale,
	            "autoWidth": false,
	            "scrollX": true,
	            "lengthMenu": [[25, 50, 75, 100, -1], [25, 50, 75, 100, '全部']],
	            "ajax": {
	                "url": url,
	                "dataSrc": function dataSrc(json) {
	                    var data = [];
	                    $.each(json, function (k, v) {
	                        var ks = k.split("_");
	                        var o = {
	                            "id": ks[0],
	                            "hostname": v["hostname"],
	                            "session": ks[1] + "_" + ks[2],
	                            "232101": v["232101"] || "-",
	                            "232001": v["232001"] || "-",
	                            "232011": v["232011"] || "-",
	                            "232002": v["232002"] || "-",
	                            "234001": v["234001"] || "-",
	                            "234011": v["234011"] || "-"
	                        };
	                        data.push(o);
	                    });
	                    return data;
	                }
	            },
	            "order": [[7, "desc"]],
	            "columns": [{
	                // ID idx: 0
	                data: "id"
	            }, {
	                // hostname idx: 1
	                data: "hostname"
	            }, {
	                // session ID idx: 2
	                data: "session"
	            }, {
	                // 232101 转换服务启动 idx: 3
	                data: "232101"
	            }, {
	                // 232001 成功收到任务 idx: 4
	                data: "232001"
	            }, {
	                // 232011 转换任务开始 idx: 5
	                data: "232011"
	            }, {
	                // 232002 转换任务完成 idx: 6
	                data: "232002"
	            }, {
	                // 234001 接收任务失败 idx: 7
	                data: "234001",
	                render: function render(data, type, row, meta) {
	                    if ((typeof data === "undefined" ? "undefined" : _typeof(data)) == "object") {
	                        var html = ["<ul>"];
	                        $.each(data, function (k, v) {
	                            html.push('<li>', k, ": ", v, '</li>');
	                        });
	                        var tr = table.row(meta.row).node();
	                        $(tr).addClass("danger-bg");
	                        html.push("</ul>");
	                        return html.join("");
	                    } else if (typeof data == "string" && data != "-") {
	                        tr = table.row(meta.row).node();
	                        $(tr).addClass("danger-bg");
	                        return data;
	                    } else {
	                        return "-";
	                    }
	                }
	            }, {
	                // 234011 转换任务失败 idx: 8
	                data: "234011",
	                render: function render(data, type, row, meta) {
	                    if ((typeof data === "undefined" ? "undefined" : _typeof(data)) == "object") {
	                        var html = ["<ul>"];
	                        $.each(data, function (k, v) {
	                            html.push('<li>', k, ": ", v, '</li>');
	                        });
	                        var tr = table.row(meta.row).node();
	                        $(tr).addClass("danger-bg");
	                        html.push("</ul>");
	                        return html.join("");
	                    } else if (typeof data == "string" && data != "-") {
	                        tr = table.row(meta.row).node();
	                        $(tr).addClass("danger-bg");
	                        return data;
	                    } else {
	                        return "-";
	                    }
	                }
	            }]
	        });
	    }
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

/***/ }

});
//# sourceMappingURL=monitor_doc_conversion.js.map