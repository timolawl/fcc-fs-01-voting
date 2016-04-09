'use strict';

// Reason for returning gulp.src:
// http://stackoverflow.com/questions/21699146/gulp-js-task-return-on-src

var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-cssmin');

var production = process.env.NODE_ENV === 'production';

gulp.task('style', function() {
    return gulp.src('app/stylesheets/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulpif(production, cssmin())
        .pipe(gulp.dest('public/stylesheets/'));
});

gulp.task('watch', function() {
    gulp.watch('app/stylesheets/*.scss', ['style']);
});

gulp.task('default', ['watch', 'style']);
gulp.task('build', ['style']);
