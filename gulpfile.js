var gulp         = require('gulp'),
    scss         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    cashe        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    htmlmin      = require('gulp-htmlmin');

gulp.task('scss', function() {
  return gulp.src('scss/*.scss')//main.scss
    .pipe(scss())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('scriptsLib', function() {
  return gulp.src([
    'src/libs/jquery/dist/jquery.min.js',
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/js'));
});

gulp.task('stylesLib', ['scss'], function() {
  return gulp.src('src/css/libs.css')
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('src/css'));
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'src'
    },
    notify: false
  });
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('clear', function() {
  return cache.clearAll();
});

gulp.task('img', function() {
  return gulp.src('src/img/**/*')
  .pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  })))
  .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync', 'stylesLib', 'scriptsLib'], function() {
  gulp.watch('src/scss/**/*.scss', ['scss'], browserSync.reload);
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'img', 'scss', 'stylesLib', 'scriptsLib'], function() {
  
  var buildCss = gulp.src([
      'src/css/main.css',
      'src/css/libs.min.css',
    ])
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'));
  
  var buildFonts = gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
  
  var buildJs = gulp.src('src/js/**/*')
    .pipe(gulp.dest('dist/js'));
  
  var buildHtml = gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
  
});