var webpack = require('webpack');
var path = require('path');
var glob = require('glob');
/*
 extract-text-webpack-plugin插件,
 将样式提取到单独的css文件里.
 */
var ExtractTextPlugin = require('extract-text-webpack-plugin');
/*
 html-webpack-plugin插件,webpack中生成HTML的插件.
 https://www.npmjs.com/package/html-webpack-plugin
 */
var HtmlWebpackPlugin = require('html-webpack-plugin');

const debug = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: { //配置入口文件,有几个写几个
        login: './src/scripts/page/login',
        monitor_stream: './src/scripts/page/monitor_stream.js',
        monitor_gallery: './src/scripts/page/monitor_gallery.js',
        monitor_error_stat: './src/scripts/page/monitor_error_stat.js',
        monitor_log_search: './src/scripts/page/monitor_log_search.js',
        monitor_duplicate_stream: './src/scripts/page/monitor_duplicate_stream.js',
        monitor_online_users: './src/scripts/page/monitor_online_users.js',
        monitor_doc_conversion: './src/scripts/page/monitor_doc_conversion.js',
        vendor_base: ['jquery', 'lodash'],
        vendor_ui: ['semantic/semantic'],
        vendor_chart: ['echarts/dist/echarts.min'],
        vendor_table: ['./src/scripts/lib/jquery.dataTables.min']
    },
    output: {
        path: path.join(__dirname, debug ? 'dev' : "dist"), //输出目录的配置,模板 样式 脚本 图片等资源的路径配置都相对于它
        publicPath: debug ? '/dev/' : "/dist/",   //模板 样式 脚本 图片等资源对应的在server上的路径
        filename: 'js/[name].js',           //每个页面对应的主js的生成配置
        chunkFilename: 'js/[id].chunk.js?[chunkhash]'   //chunk生成的配置
    },
    module: {
        loaders: [
            {
                test: /(\.(jpe?g|png|gif|svg)$)|(\.(jpe?g|png|gif|svg)[?#])/i,
                loaders: [
                    'image?{bypassOnDebug: true, progressive:true, \
                        optimizationLevel: 3, pngquant:{quality: "65-80"}}',
                    'url?limit=10000&name=./images/[hash:8].[name].[ext]'
                ]
            },
            {test: /(\.(woff|eot|ttf|woff2)$)|(\.(woff|eot|ttf|woff2)[?#])/i, loader: 'url?limit=10000&name=css/semantic/font/[name].[ext]'},
            //{test: /\.js?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/},
            {test: /\.js$/, loader: 'babel?presets[]=es2015', exclude: /node_modules/},
            {test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')},
            {test: /\.less$/, loader: ExtractTextPlugin.extract('css!less')},
            {test: /\.jade$/, loader: "jade"},
            {test: /\.html$/, loader: "html?attrs=img:src img:data-src"}
        ]
    },
    resolve: {
        root: [process.cwd() + '/src'],
        alias: {},
        extensions: ['', '.js', '.json']
    },
    plugins: [
        new webpack.ProvidePlugin({ //加载jq
            $: 'jquery',
            jQuery: 'jquery',
            "window.jQuery": "jquery"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ["vendor_ui", "vendor_chart", "vendor_table", "vendor_base"],
            minChunks: Infinity
        }),
        new ExtractTextPlugin('css/[name].css'), //单独使用link标签加载css并设置路径,相对于output配置中的publickPath
        new webpack.HotModuleReplacementPlugin(), //热加载
        new webpack.NoErrorsPlugin(),

        // login
        new HtmlWebpackPlugin({
            favicon: './src/images/favicon.ico',
            filename: './login.html',
            template: './src/jade/login.jade',
            inject: 'body',
            hash: true,
            chunks: ['vendor_base', 'vendor_ui', 'login'],
            chunksSortMode: 'dependency'
        }),

        // 流状态监控
        new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
            favicon: './src/images/favicon.ico', //favicon路径,通过webpack引入同时可以生成hash值
            filename: './monitor_stream.html', //生成的html存放路径,相对于path
            template: './src/jade/monitor_stream.jade', //html模板路径
            inject: 'body', //js插入的位置,true/'head'/'body'/false
            hash: true, //为静态资源生成hash值
            chunks: ['vendor_base', 'vendor_ui', 'vendor_table', 'vendor_chart', 'monitor_stream'], //需要引入的chunk,不配置就会引入所有页面的资源
            chunksSortMode: 'dependency'
            //minify: { //压缩HTML文件
            //    removeComments: true, //移除HTML中的注释
            //    collapseWhitespace: false //删除空白符与换行符
            //}
        }),

        // gallery
        new HtmlWebpackPlugin({
            favicon: './src/images/favicon.ico',
            filename: './monitor_gallery.html',
            template: './src/jade/monitor_gallery.jade',
            inject: 'body',
            hash: true,
            chunks: ['vendor_base', 'vendor_ui', 'monitor_gallery'],
            chunksSortMode: 'dependency'
        }),

        // 错误统计
        new HtmlWebpackPlugin({
            favicon: './src/images/favicon.ico',
            filename: './monitor_error_stat.html',
            template: './src/jade/monitor_error_stat.jade',
            inject: 'body',
            hash: true,
            chunks: ['vendor_base', 'vendor_ui', 'vendor_chart', 'monitor_error_stat'],
            chunksSortMode: 'dependency'
        }),

        // 日志查询
        new HtmlWebpackPlugin({
            favicon: './src/images/favicon.ico',
            filename: './monitor_log_search.html',
            template: './src/jade/monitor_log_search.jade',
            inject: 'body',
            hash: true,
            chunks: ['vendor_base', 'vendor_ui', 'vendor_table', 'monitor_log_search'],
            chunksSortMode: 'dependency'
        }),

        // 重复推流列表
        new HtmlWebpackPlugin({
            favicon: './src/images/favicon.ico',
            filename: './monitor_duplicate_stream.html',
            template: './src/jade/monitor_duplicate_stream.jade',
            inject: 'body',
            hash: true,
            chunks: ['vendor_base', 'vendor_ui', 'vendor_table', 'monitor_duplicate_stream'],
            chunksSortMode: 'dependency'
        }),

        // 在线用户
        new HtmlWebpackPlugin({
            favicon: './src/images/favicon.ico',
            filename: './monitor_online_users.html',
            template: './src/jade/monitor_online_users.jade',
            inject: 'body',
            hash: true,
            chunks: ['vendor_base', 'vendor_ui', 'vendor_chart', 'monitor_online_users'],
            chunksSortMode: 'dependency'
        }),

        // 文档转换
        new HtmlWebpackPlugin({
            favicon: './src/images/favicon.ico',
            filename: './monitor_doc_conversion.html',
            template: './src/jade/monitor_doc_conversion.jade',
            inject: 'body',
            hash: true,
            chunks: ['vendor_base', 'vendor_ui', 'vendor_table', 'monitor_doc_conversion'],
            chunksSortMode: 'dependency'
        })
    ]
};
