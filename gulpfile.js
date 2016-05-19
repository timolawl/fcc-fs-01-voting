'use strict';

// Reason for returning gulp.src:
// http://stackoverflow.com/questions/21699146/gulp-js-task-return-on-src

const browserSync = require('browser-sync').create();

const gulp = require('gulp');
// const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const imagemin = require('gulp-imagemin');

// var production = process.env.NODE_ENV === 'production';

gulp.task('browserSync', () => {
    browserSync.init({
        proxy: 'localhost:5000', // heroku local -> gulp watch -> localhost:3000
        ghostMode: true, // sync across all browsers
        port: 3000 // the port that browserSync uses
    });
});

gulp.task('sass', () => {
    return gulp.src('./app/client/stylesheets/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
    //    .pipe(gulpif(production, cssmin()))
        .pipe(cssmin())
        .pipe(gulp.dest('./static/css/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('image', () => {
    return gulp.src('./app/client/images/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('./static/img'));
});

gulp.task('watch', ['browserSync', 'sass'], () => {
    gulp.watch('./app/client/stylesheets/*.scss', ['sass']);
  //  gulp.watch('public/*.html', browserSync.reload);
  //  gulp.watch('public/js/**/*.js', browserSync.reload);
  //    gulp.watch('*', browserSync.reload);
});

gulp.task('default', ['watch', 'sass']);
gulp.task('build', ['sass']);
