var gulp = require('gulp')
var sass = require('gulp-sass')
var header = require('gulp-header')
var cleanCSS = require('gulp-clean-css')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var pkg = require('./package.json')
var clean = require('gulp-clean')
var browserSync = require('browser-sync').create()

// Set the banner content
var banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
  ' */\n',
  ''
].join('')

// Compile SCSS
gulp.task('css:compile', function () {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./css'))
})

// Minify CSS
gulp.task('css:minify', ['css:compile'], function () {
  return gulp.src([
    './css/*.css',
    '!./css/*.min.css'
  ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream())
})

// CSS
gulp.task('css', ['css:compile', 'css:minify'])

// Default task
gulp.task('default', ['css'])

// Configure the browserSync task
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: './'
    }
  })
})

// Prepare publish
gulp.task('cleanup', function () {
  return gulp.src(['dist', 'css'], {read: false})
    .pipe(clean())
})
gulp.task('build', ['cleanup', 'css:compile'], function () {

  gulp.src([
    './css/*.css',
    '!./css/*.min.css'
  ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/css'))

  gulp.src([
    './index.html',
    './fonts'
  ])
    .pipe(gulp.dest('./dist'))

  gulp.src([
    './img/*.jpg'
  ])
    .pipe(gulp.dest('./dist/img'))

})

// Dev task
gulp.task('dev', ['css', 'browserSync'], function () {
  gulp.watch('./scss/*.scss', ['css'])
  gulp.watch('./*.html', browserSync.reload)
})
