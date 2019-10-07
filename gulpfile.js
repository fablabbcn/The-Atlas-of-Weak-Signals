const gulp = require('gulp'),
    sass = require('gulp-sass'),
    browsersync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    header  = require('gulp-header'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat'),
    package = require('./package.json'),
    ghPages = require('gulp-gh-pages'),
    path = require('path'),
    babel = require("gulp-babel"),
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps');


var banner = [
    '/*!\n' +
    ' * <%= package.name %>\n' +
    ' * <%= package.title %>\n' +
    ' * <%= package.url %>\n' +
    ' * @author <%= package.author %>\n' +
    ' * @version <%= package.version %>\n' +
    ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
    ' */',
    '\n'
].join('');

function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./app"
        },
        port: 3000
    });
    done();
}
function browserSyncReload(done) {
    browsersync.reload();
    done();
}
function watchFiles(){
    gulp.watch('src/js/**/*', gulp.series(scripts));
    gulp.watch('src/sass/**/*', gulp.series(styles));
}

function clean(){
    return del(['app/assets/*.js', 'app/assets/*.css']);
}
function styles(){
    return ( gulp.src('src/sass/style.scss')
            .pipe(sass({errLogToConsole: true}))
            .pipe(autoprefixer('last 4 version'))
            .pipe(gulp.dest('app/assets'))
            .pipe(cssnano())
            .pipe(rename({ suffix: '.min' }))
            .pipe(header(banner, { package : package }))
            .pipe(gulp.dest('app/assets'))
            .pipe(browsersync.stream())
    );
}
function scripts(){
    return (gulp.src('src/js/*.js')
            .pipe(sourcemaps.init())
            .pipe(babel())
            .pipe(header(banner, { package : package }))
            .pipe(concat('scripts.js'))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('app/assets/'))
            // .pipe(uglify())
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest('app/assets/'))
            .pipe(browsersync.stream())
    );
}


const js = gulp.series(scripts);
const build = gulp.series(clean, gulp.parallel(scripts, styles));
const watch = gulp.parallel(watchFiles, browserSync);
gulp.task('deploy', () => gulp.src('./app/**/*').pipe(ghPages()));


exports.js = scripts;
exports.clean = clean;
exports.css = styles;
exports.watch = watch;
exports.build = build;
exports.default = build;