(function () {

    'use strict';

    var path = require('path');
    var gulp = require('gulp');
    var conf = require('./conf');
    var purifyCss = require("purify-css");
    var $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
    });
    var critical = require("critical").stream;
    var gutil = require("gulp-util");

    function htmlTask() {

        var htmlFilter = $.filter('*.html', {restore: true, dot: true});
        var jsFilter = $.filter('**/*.js', {restore: true, dot: true});
        var cssFilter = $.filter('**/*.css', {restore: true, dot: true});

        return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
            .pipe($.useref())
            .pipe(jsFilter)
            .pipe($.uglify({preserveComments: $.uglifySaveLicense})).on('error', conf.errorHandler('Uglify'))
            // .pipe($.rev())
            // .pipe($.sourcemaps.write('maps'))
            .pipe(jsFilter.restore)
            .pipe(cssFilter)
            .pipe($.cleanCss({processImport: false}))
            // .pipe($.rev())
            // .pipe($.sourcemaps.write('maps'))
            .pipe(cssFilter.restore)
            .pipe($.revReplace())
            .pipe(htmlFilter)
            .pipe($.htmlmin({
                removeEmptyAttributes: true,
                removeAttributeQuotes: true,
                collapseBooleanAttributes: true,
                collapseWhitespace: true
            }))
            .pipe(htmlFilter.restore)
            .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
            .pipe($.size({title: path.join(conf.paths.dist, '/'), showFiles: true}))

    }



    // Generate & Inline Critical-path CSS

    gulp.task('other', function () {
        var fileFilter = $.filter(function (file) {
            return file.stat.isFile();
        });

        return gulp.src([
            path.join(conf.paths.favicons, '/**/*.{ico,png}'),
            path.join(conf.paths.src, '/_assets/**/*'),
            path.join('!' + conf.paths.src, '/_assets/**/*.{html,css,js,scss}')
        ])
            .pipe(fileFilter)
            .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
    });

    gulp.task('clean', function () {
        return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
    });

    gulp.task('html', ['inject'], htmlTask);

    gulp.task('build', ['html', 'other', 'images', 'fonts', 'critical', 'purifycss']);

    gulp.task('critical', ['purifycss'], function () {
        return gulp.src(path.join(conf.paths.dist, '/*.html'))
            .pipe(critical({base: path.join(conf.paths.dist, '/'), inline: true, minify: true, extract: true, ignore: ['@font-face']}))
            .on('error', function(err) { gutil.log(gutil.colors.red(err.message)); })
            .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
    });

    gulp.task('purifycss',['html'], function () {
        var content = [path.join(conf.paths.dist, '/**/*.{html,js}'), 'bower_components/**/*.js'];
        var css = [path.join(conf.paths.dist, '/styles/**/*.css')];
        purifyCss(content, css, {info: true, rejected: true, minify: true}, function (result) {
            console.log(result);
        });
    });

})();