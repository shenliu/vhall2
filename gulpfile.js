var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");

var del = require('del');

var sequence = require('gulp-sequence');

const debug = process.env.NODE_ENV !== 'production';

// 清空dev dev
gulp.task('clean', function() {
    return del('dev/**/*') && del('dist/**/*');
});

//---------------------------------------------------------------//

// 一些必要的工作
gulp.task('todo', function() {
    var path = debug ? './dev/' : './dist/';
    // 拷贝player目录到dev
    gulp.src('./player/**/*').pipe(gulp.dest(path + 'player/'));
    // 拷贝images目录到dev
    gulp.src(['./src/images/**/*', '!./src/images/*.ico']).pipe(gulp.dest(path + 'images/'));
});

//---------------------------------------------------------------//

gulp.task("default", sequence(["clean"], ["build-dev"], ["todo"], "webpack-dev-server"));

gulp.task('dist', sequence(["clean"], ["webpack:build"], ["todo"]));

//---------------------------------------------------------------//

gulp.task("webpack:build", function(callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({ //压缩代码
            compress: {
                warnings: false
            },
            comments: false,
            mangle: {
                except: ['$super', '$', 'exports', 'require']
            }
        })
    );

    // run webpack
    webpack(myConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        callback();
    });
});

//---------------------------------------------------------------//

// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh
gulp.task("build-dev", ["webpack:build-dev"], function() {
    gulp.watch(["src/**/*"], ["webpack:build-dev"]);
});

//---------------------------------------------------------------//

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task("webpack:build-dev", function(callback) {
    // run webpack
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build-dev", err);
        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));
        callback();
    });
});

//---------------------------------------------------------------//

gulp.task("webpack-dev-server", function(callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.devtool = "eval";
    myConfig.debug = true;

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), {
        publicPath: "/" + myConfig.output.publicPath,
        stats: {
            colors: true
        }
    }).listen(8080, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    });
});