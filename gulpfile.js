const gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    header  = require('gulp-header'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat'),
    package = require('./package.json'),
    ghPages = require('gh-pages'),
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



/*

gulp.task('css', function () {
    return gulp.src('src/scss/style.scss')
        .pipe(sass({errLogToConsole: true}))
        .pipe(autoprefixer('last 4 version'))
        .pipe(gulp.dest('app/assets/css'))
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(header(banner, { package : package }))
        .pipe(gulp.dest('app/assets/css'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "app"
        }
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['css', 'js', 'browser-sync'], function () {
    // gulp.watch("src/scss/*<<<<<</*.scss", ['css']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("app/*.html", ['bs-reload']);
});

gulp.task('deploy', ['css', 'js'], function(cb) {
    ghPages.publish(path.join(process.cwd(), 'app'), cb);
});

*/



function clean(){
    return del(["pub/assets/*"]);
}


function css(){
    return ( gulp.src('src/sass/style.scss')
        .pipe(sass({errLogToConsole: true}))
        // .pipe(autoprefixer('last 4 version'))
        .pipe(gulp.dest('pub/assets'))
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(header(banner, { package : package }))
        .pipe(gulp.dest('pub/assets'))
    );
}

function scripts(){
    return (gulp.src('src/js/*.js')
            .pipe(sourcemaps.init())
            .pipe(babel())
            .pipe(header(banner, { package : package }))
            .pipe(concat('scripts.js'))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest("pub/assets/"))
            .pipe(uglify())
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest("pub/assets/"))
    );
}

const js = gulp.series(scripts);
const build = gulp.series(clean, gulp.parallel(scripts, css));

exports.js = js;
exports.clean = clean;
exports.sass = css;
exports.build = build;
exports.default = build;