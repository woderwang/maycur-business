const babel = require("@babel/core");
const yargs = require('yargs').argv;
const cleanCss = require('gulp-clean-css');
const rmfr = require('rmfr')
const gulp = require('gulp');
const ncp = require('cpy');
const fs = require('fs');
const concat = require('gulp-concat');
const through2 = require('through2');
const path = require('path');
const transformLess = require('./transformLess');
const bsConfig = require('./tool.config');
let currentCwd = process.cwd();
let targeFolderName = 'components';
let devDestination = path.resolve(currentCwd, 'libdev/lib');
let esDestination = path.resolve(currentCwd, 'es');
let libDestination = path.resolve(currentCwd, 'lib');
let mode = yargs.dev === 'true' ? 'dev' : 'build';
let developDir = bsConfig.developDir;
let lessPath = path.resolve(currentCwd, `${targeFolderName}/**/*.less`);
let jsPath = path.resolve(currentCwd, `${targeFolderName}/**/*.{jsx,js}`);
console.log(developDir);
gulp.task('less', () => {
    console.log('step1.start to compile .less file');
    return gulp.src([lessPath])
        .pipe(through2.obj(function (file, encoding, next) {
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
            path.resolve(currentCwd, targeFolderName)
        ))
        .pipe(concat('mkbs.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest('style'))
        .pipe(gulp.dest(devDestination));
});
gulp.task('copy', ['less'], () => {
    console.log('step2.copy less,css files to target folder');
    return gulp.src([path.resolve(currentCwd, `${targeFolderName}/**/*.{less,css,md}`)])
        .pipe(gulp.dest(
            path.resolve(esDestination)
        ))
        .pipe(gulp.dest(
            path.resolve(libDestination)
        ))
        .pipe(gulp.dest(
            path.resolve(devDestination)
        ))
});

gulp.task('babel', ['copy'], () => {
    console.log('step3.start compile jsx')
    return gulp.src([jsPath])
        .pipe(
            through2.obj(function (file, encoding, next) {
                let jsContent = babel.transformFileSync(file.path, {});
                file.contents = Buffer.from(jsContent.code);
                this.push(file);
                next();
            })
        )
        .pipe(gulp.dest(esDestination))
        .pipe(gulp.dest(libDestination))
        .pipe(gulp.dest(devDestination))
        .on('end', function () {
            if (mode === 'dev' && !!developDir) {
                ncp(devDestination, developDir).then(() => {
                    console.log(`${developDir} 目录下的文件已经同步!`);
                })
            }
        })
});

async function build() {
    await rmfr(devDestination);
    console.log(`remove ${devDestination}`)
    await rmfr(esDestination);
    console.log(`remove ${esDestination}`)
    await rmfr(libDestination);
    console.log(`remove ${libDestination}`)
    gulp.start('babel');
};
build().then(() => {
    if (mode === 'dev') {
        gulp.watch([lessPath, jsPath], build);
    }
});

