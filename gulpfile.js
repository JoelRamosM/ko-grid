var gulp = require("gulp");
var rename = require("gulp-rename");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var stringify = require("stringify");
var uglify = require('gulp-uglify');
var pump = require('pump');
var util = require("gulp-util");

gulp.task("default",["build"])

gulp.task("bundle", function () {
    return browserify({ entries: ["scripts/all.js"] })
                        .transform(stringify([".html"]))
                        .bundle()
                        .pipe(source("ko-grid.js"))
                        .pipe(gulp.dest("dist"));
});

gulp.task("build",["bundle"],function(cb){
    pump([
         gulp.src('dist/ko-grid.js'),
         rename("ko-grid.min.js"),         
         uglify(),
         gulp.dest('dist')
    ],cb)
})