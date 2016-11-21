'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync').create();

gulp.task('sass', function() {
    return gulp.src('app/_scss/*.scss', {style:'expanded'})
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('app/public/css/'))
        .pipe(browserSync.stream())
        .pipe(notify({
            message: 'Styles task complete'
        }));
});

gulp.task('js', function() {
    return gulp.src('app/_js/*.js')
        .pipe(gulp.dest('app/public/js/'))
        .pipe(notify({
            message: 'JS task complete'
        }));
});

gulp.task('serve', ['js', 'sass'], function() {

    browserSync.init({
        server: "./app/public",
        port: 8016
      
    });
    gulp.watch('app/_scss/**/*.scss', ['sass']);
    gulp.watch('app/_js/**/*.js', ['js-watch']);
    gulp.watch('app/public/*.html' ).on('change', browserSync.reload);
});

gulp.task('js-watch', ['js'], function(done) {
    browserSync.reload();
    done();
});


gulp.task('default', ['serve']);
