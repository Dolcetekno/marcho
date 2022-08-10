const { src, dest, watch, parallel} = require ('gulp');

const sass           = require('gulp-sass')(require('sass')); 
const concat         = require('gulp-concat');
const autoprefixer   = require('gulp-autoprefixer')
const uglify         = require('gulp-uglify');
const browserSync    = require('browser-sync').create();
const imagemin       = require('gulp-imagemin');


function browsersync (){
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    })

}

function styles() {
    return src('app/scss/style.scss')
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 versions'],
        grid: true  
        
    }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())

}

function watching(){
watch(['app/scss/**/*.scss'], styles);
watch(['app/js/**/*.js','!app/main.min.js'], scripts);
watch(['app/**/*.html']).on('change', browserSync.reload);
}


function scripts (){
    return src(
        [
            'node_modules/jquery/dist/jquery.js',
            'app/js/main.js'
        ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())

}

function images(){
    return src('app/images/**/*.*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest('dist/images'))
}

function build(){
    return src(['app/**/*.html', 
    'app/css/style.min.css',
    'app/js/main.min.js'])
.pipe(dest('dist'))
}


exports.styles = styles; 

exports.scripts = scripts; 

exports.browsersync= browsersync;

exports.watching = styles; 

exports.images=images;

exports.build=build;

exports.default = parallel(styles, scripts,watching,browsersync);
