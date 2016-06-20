var gulp = require('gulp');
var typescript = require('gulp-typescript');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var jasmine = require('gulp-jasmine');
var tsProject = typescript.createProject('tsconfig.json', {
    outDir: 'dist/js'
});

gulp.task('ts', function () {
    var result = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject));
    return result.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('watch-ts', function () {
    return gulp.watch(['scripts/*.ts', 'spec/*.spec.ts'], ['ts', 'jasmine']);
});

gulp.task('jasmine', ['ts'], function () {
    return gulp.src('dist/**/*.spec.js')
        .pipe(jasmine());
});

gulp.task('less', function () {
    return gulp.src('**/*.less')
        .pipe(less({}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch-less', function () {
    return gulp.watch(['styles/*.less'], ['less']);
});

gulp.task('watch', ['watch-ts', 'watch-less'], function () { });

gulp.task('default', ['watch', 'jasmine'], function () {});