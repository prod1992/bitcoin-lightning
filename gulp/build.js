(function () {

    'use strict';

    const path = require('path');
    const gulp = require('gulp');
    const conf = require('./conf');
    const purifyCss = require("purify-css");
    const $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
    });
    const critical = require("critical").stream;
    const gutil = require("gulp-util");

    function htmlTask() {

        const htmlFilter = $.filter('*.html', {restore: true, dot: true});
        const jsFilter = $.filter('**/*.js', {restore: true, dot: true});
        const cssFilter = $.filter('**/*.css', {restore: true, dot: true});

        return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
            .pipe($.useref())
            .pipe(jsFilter)
            .pipe($.uglify())
            .on('error', function (err) {
                gutil.log(gutil.colors.red('[Error]'), err.toString());
                this.emit('end');
            })
            .pipe($.sourcemaps.init({loadMaps: true}))
            .pipe($.sourcemaps.write('./'))
            .pipe(jsFilter.restore)
            .pipe(cssFilter)
            .pipe($.cleanCss({processImport: false}))
            .pipe($.rev())
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
        const fileFilter = $.filter(function (file) {
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

    gulp.task('build', ['html', 'other', 'images', 'fonts', 'purifycss', 'critical', 'cssfinalminify']);

    gulp.task('critical', ['html'], function () {
        return gulp.src(path.join(conf.paths.dist, '/*.html'))
            .pipe(critical({
                base: path.join(conf.paths.dist, '/'),
                inline: true,
                minify: true,
                extract: true,
                assetPaths: ['images', 'fonts']
            }))
            .on('error', function (err) {
                gutil.log(gutil.colors.red(err.message));
            })
            .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
    });

    gulp.task('purifycss', ['critical'], function () {
        let content = [
            path.join(conf.paths.tmp, '/**/*.{js,html}'),
        ];
        let css = [path.join(conf.paths.dist, '/styles/*.css')];
        purifyCss(content, css, { info: true, rejected: true}, function(res) {

        });
    });

    gulp.task('cssfinalminify', ['purifycss'], function () {
        return gulp.src(path.join(conf.paths.dist, '/styles/*.css'))
            .pipe($.cleanCss({debug: true}, (details) => {

            }))
            .pipe(gulp.dest(path.join(conf.paths.dist, '/styles/')))
            .pipe($.size({title: path.join(conf.paths.dist, '/styles/'), showFiles: true}));
    });


})();