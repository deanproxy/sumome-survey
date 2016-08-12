"use strict";

var gulp = require('gulp');
var glob = require('glob');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var path = require('path');
var _ = require('lodash');

var bundleOpts = {
    jsSrc: [],
    jsDest: 'public/javascripts/bundle'
}

/** Make sure files are placed in the right order. Some things depends on others.  */
bundleOpts.jsSrc = bundleOpts.jsSrc.concat(
  glob.sync('public/javascripts/react/*.js')
);

let watchBundles = [];
_.each(bundleOpts.jsSrc, src => {
  let opts = assign({}, watchify.args, {
    entries: src,
    debug: true
  });

  watchBundles.push({
    filename: path.basename(src),
    watch: watchify(browserify(opts))
      .transform(babelify, {presets: ['es2015', 'react']})
      .on('update', watch)
      .on('log', gutil.log)
  });
});

gulp.task('build', build);
gulp.task('browserify', build);
gulp.task('watch', watch);

gulp.task('sass', buildSass);

function buildSass() {
  gulp.src('public/stylesheets/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/stylesheets/'))
}

/* Build: Used to deploy minified code for production use. */
function build() {
  _.each(bundleOpts.jsSrc, file => {
    var b = browserify({
      entries: file,
      debug: false
    });

    buildSass();
    b.transform(babelify, {presets: ['es2015', 'react']})
    .bundle()
    .on('error', gutil.log.bind(gutil, "Browserify Error"))
    .pipe(source(path.basename(file)))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(sourcemaps.init({loadMaps:true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(bundleOpts.jsDest))
  });
}

/* Watch: Used to watch files for changes for development use. */
function watch() {
  buildSass();
  gulp.watch('public/stylesheets/**/*.scss', ['sass']);
  return _.each(watchBundles, watch => {
    watch.watch.bundle()
      .on('error', gutil.log.bind(gutil, "Browserify Error"))
      .pipe(source(watch.filename))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps:true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(bundleOpts.jsDest))
  });
}

