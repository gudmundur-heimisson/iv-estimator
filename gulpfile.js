var gulp = require('gulp');
var typescript = require('gulp-typescript');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var jasmine = require('gulp-jasmine');
var tsProject = typescript.createProject('tsconfig.json', {
    rootDir: 'src/ts',
    outDir: '../../dist/js'
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
    return gulp.watch(['src/ts/*.ts'], ['ts']);
});

gulp.task('ts-spec', function () {
    var result = gulp.src(['typings/index.d.ts', 'src/ts/*.ts', 'spec/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(typescript({
            noImplicitAny: true,
            rootDir: 'spec',
            outDir: 'js'
        }));
    return result.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('spec/js'));
});

gulp.task('watch-spec', function () {
    return gulp.watch(['src/ts/*.ts', 'spec/*.spec.ts'], ['ts-spec', 'jasmine']);
});

gulp.task('jasmine', ['ts-spec'], function () {
    return gulp.src('spec/**/*.spec.js')
        .pipe(jasmine());
});

gulp.task('less', function () {
    return gulp.src('src/less/*.less')
        .pipe(less({}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch-less', function () {
    return gulp.watch(['src/less/*.less'], ['less']);
});

gulp.task('watch', ['watch-ts', 'watch-spec', 'watch-less'], function () { });