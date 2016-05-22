'use strict';

// Reason for returning gulp.src:
// http://stackoverflow.com/questions/21699146/gulp-js-task-return-on-src

const browserSync = require('browser-sync').create();

const gulp = require('gulp');
const gutil = require('gulp-util');
// const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');

const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const babelify = require('babelify');

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

gulp.task('script', () => {
    return browserify('./app/client/scripts/script.js', { debug: true })
        .transform(babelify.configure({ presets: ['es2015'] }))
        .bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify error.'))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify({ mangle: false })) // why does it work now without compress?
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('static/js'));
});

gulp.task('image', () => {
    return gulp.src('./app/client/images/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('./static/img'));
});

gulp.task('watch', ['browserSync', 'sass'], () => {
    gulp.watch('./app/client/stylesheets/*.scss', ['sass']);
    gulp.watch('./app/client/scripts/*.js', ['script']);
  //  gulp.watch('public/*.html', browserSync.reload);
  //  gulp.watch('public/js/**/*.js', browserSync.reload);
  //    gulp.watch('*', browserSync.reload);
});

gulp.task('default', ['watch', 'sass', 'script']);
gulp.task('build', ['sass', 'script']);
