'use strict';

// Reason for returning gulp.src:
// http://stackoverflow.com/questions/21699146/gulp-js-task-return-on-src

var browserSync = require('browser-sync').create();

var gulp = require('gulp'),
//    gulpif = require('gulp-if'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-cssmin');

// var production = process.env.NODE_ENV === 'production';

gulp.task('browserSync', function () {
    browserSync.init({
        proxy: 'localhost:5000', // heroku local -> gulp watch -> localhost:3000
        ghostMode: true // sync across all browsers
    });
});

gulp.task('sass', function () {
    return gulp.src('app/stylesheets/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
    //    .pipe(gulpif(production, cssmin()))
        .pipe(cssmin())
        .pipe(gulp.dest('public/stylesheets/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch', ['browserSync', 'sass'],  function () {
    gulp.watch('app/stylesheets/*.scss', ['sass']);
    gulp.watch('public/*.html', browserSync.reload);
    gulp.watch('public/js/**/*.js', browserSync.reload);
});

gulp.task('default', ['watch', 'sass']);
gulp.task('build', ['sass']);
