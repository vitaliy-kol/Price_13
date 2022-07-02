var gulp = require('gulp');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var del = require('del');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var spritesmith = require('gulp.spritesmith');
const sass = require('gulp-sass')(require('sass'));

var cssFiles = [
    './src/css/reset.css',
    './src/css/style.css'
];

//var jsFiles = [];

function sprite() {
    var spriteData = gulp.src('./src/img_sprite/**/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.scss'
        }));
    spriteData.css.pipe(gulp.dest('./src/sass'))
    return spriteData.img.pipe(gulp.dest('./build/css'));
}

function SASStoCSS() {
    return gulp.src('./src/sass/**/style.scss')
        .pipe(sass({
            errorLogToConsole: true,
            outputStyle: 'compressed'
        }))
        .pipe(cleanCSS({
            level: 0,
            format: 'beautify'
        }))
        .pipe(gulp.dest('./src/css'))
        .pipe(browserSync.stream());
}

function img_com() {
    return gulp.src('./src/img/**/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('./build/img_com'))
        .pipe(browserSync.stream());
}

function styles() {
    return gulp.src(cssFiles)
        .pipe(concat('all.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['> 0.1%'],
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
}
/*
function scripts() {
    return gulp.src(jsFiles)
        .pipe(concat('all.js'))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
}
*/
function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        host: '192.168.0.101',
        notify: false,
        tunnel: true
    });
    gulp.watch('./src/img_sprite/**', sprite);
    gulp.watch('./src/img_com/**', img_com);
    gulp.watch('./src/sass/**', SASStoCSS);
    gulp.watch('./src/css/**/*.css', styles);
    //gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch('./*.html', browserSync.reload);
}

function clean() {
    return del(['build/*', 'src/css/style.css', 'src/sass/sprite.scss'])
}

gulp.task('sprite', sprite);
gulp.task('img_com', img_com);
gulp.task('SASStoCSS', SASStoCSS);
gulp.task('styles', styles);
//gulp.task('scripts', scripts);
gulp.task('watch', watch);

gulp.task('build', gulp.series(clean,
    gulp.series(sprite, SASStoCSS, img_com, styles)));

gulp.task('dev', gulp.series('build', 'watch'));