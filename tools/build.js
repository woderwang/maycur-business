/* transform less to css */
const minifyCss = require('gulp-minify-css');
const gulp = require('gulp');
const fs = require('fs');
const concat = require('gulp-concat');
const through2 = require('through2');
const path = require('path');
const transformLess = require('./transformLess');
let currentCwd = process.cwd();
gulp.task('less', () => {
    console.log('start to compile .less file');
    let targeFolderName = 'components';
    gulp.src([path.resolve(currentCwd, `${targeFolderName}/**/*.less`)])
        .pipe(through2.obj(function(file, encoding, next){            
            transformLess(file.path).then((css) => {
                file.contents = Buffer.from(css);
                file.path = file.path.replace(/\.less$/, '.css');                
                this.push(file)
                next();
            }).catch((e) => {
                console.error(e);
            });
        }))    
        .pipe(gulp.dest(
            path.resolve(currentCwd,targeFolderName)
        ))
        .pipe(concat('mkbs.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./style'));
});

gulp.start('less');