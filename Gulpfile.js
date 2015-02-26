var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var del = require('del');
var jscs = require('gulp-jscs-custom');
var babel = require('gulp-babel');

var browserifyConfig = {
  entries: ['./index.js'],
  standalone: 'Biff'
};

gulp.task('clean', function(cb) {
  del(['lib', 'dist'], cb);
});

gulp.task('lib', ['clean'], function() {
  return gulp.src('src/*.js')
             .pipe(babel())
             .pipe(gulp.dest('lib'))

});

gulp.task('browserify', ['lib'], function() {
  return browserify(browserifyConfig)
          .bundle()
          .pipe(source('Biff.js'))
          .pipe(gulp.dest('./dist/'))
});

gulp.task('jscs', function(){
  return gulp.src('src/*.js')
      .pipe(jscs({esnext: true}))
});

gulp.task('default', ['jscs', 'clean', 'lib', 'browserify']);
