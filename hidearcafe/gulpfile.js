const {
    src,
    dest,
    series,
    watch
} = require("gulp");
// const concat = require("gulp-concat");
const sass = require("gulp-sass");
const clean = require("gulp-clean");
const fileinclude = require("gulp-file-include");

//搬運圖片
function moveImg() {
    return src("src/images/**/*.*").pipe(dest("dist/images/"));
}
exports.moveImg = moveImg;
//刪除圖片
function clearImg() {
    //src  檔案路徑
    return src("dist/images", {
        read: false, //避免 gulp 去讀取檔案內容，讓刪除效能變好
        force: true, //強制刪除
        allowEmpty: true,
    }).pipe(clean());
}
exports.cleanImg = clearImg;
//搬運html（src->dist）
function moveHTML() {
    return src("src/*.html").pipe(dest("dist/"));
}
exports.moveHTML = moveHTML;

function includeHTML() {
    return src("src/*.html")
        .pipe(
            fileinclude({
                prefix: "@@",
                basepath: "@file",
            })
        )
        .pipe(dest("dist/"));
    done();
}
exports.html = includeHTML;
//刪除html
function clearHtml() {
    //src  檔案路徑
    return src("dist/*.html", {
        read: false, //避免 gulp 去讀取檔案內容，讓刪除效能變好
        force: true, //強制刪除
        allowEmpty: true,
    }).pipe(clean());
}
exports.cleanHTML = clearHtml;

const sourcemaps = require('gulp-sourcemaps'); //追溯css的sass
//sass轉css
function sassStyle() {
    return src("src/sass/*.scss").pipe(sourcemaps.init()).pipe(sass().on("error", sass.logError)).pipe(sourcemaps.write()).pipe(dest("dist/css"));
}
exports.sass = sassStyle;

//刪除css
function clearCss() {
    return src("dist/css", {
        read: false,
        force: true, //force to delete
        allowEmpty: true,
    }).pipe(clean());
}
exports.del = clearCss;

//搬運js（src->dist）
function moveJs() {
    return src("src/js/**/*.js").pipe(dest("dist/js/"));
}
exports.moveJs = moveJs;
//刪除Js
function clearJs() {
    //src  檔案路徑
    return src("dist/js/**/*.js", {
        read: false, //避免 gulp 去讀取檔案內容，讓刪除效能變好
        force: true, //強制刪除
        allowEmpty: true,
    }).pipe(clean());
}
exports.clearJs = clearJs;
//搬運json（src->dist）
function moveJson() {
    return src("src/js/json/*.json").pipe(dest("dist/js/json/"));
}
exports.moveJson = moveJson;
//刪除Js
function clearJson() {
    //src  檔案路徑
    return src("dist/js/json/*.json", {
        read: false,
        force: true,
        allowEmpty: true,
    }).pipe(clean());
}

exports.clearJson = clearJson;
//搬運php（src->dist）
function movePhp() {
    return src("src/phps/*.php").pipe(dest("dist/phps/"));
}
exports.movePhp = movePhp;


//刪除php
function clearPhp() {
    //src  檔案路徑
    return src("dist/php", {
        read: false, //避免 gulp 去讀取檔案內容，讓刪除效能變好
        force: true, //強制刪除
        allowEmpty: true,
    }).pipe(clean());
}
exports.clearPhp = clearPhp;
//搬運vendors（src->dist）
function moveVendors() {
    return src("src/vendors/**/**/**/*.*").pipe(dest("dist/vendors/"));
}
exports.moveVendors = moveVendors;
//刪除vendors
function clearVendors() {
    //src  檔案路徑
    return src("dist/vendors", {
        read: false, //避免 gulp 去讀取檔案內容，讓刪除效能變好
        force: true, //強制刪除
        allowEmpty: true,
    }).pipe(clean());
}
exports.clearVendors = clearVendors;
//watch
function watchFile() {
    watch("src/sass/**/*.scss", series(clearCss, sassStyle));
    watch("src/js/**/*.js", series(clearJs, moveJs));
    watch("src/js/json/*.json", series(clearJson, moveJson));
    watch(["src/*.html", "src/layout/nav.html", "src/layout/footer.html", "src/layout/cart.html", ], series(clearHtml, includeHTML));
    // watch("src/*.html", series(clearHtml, moveHTML));
    watch("src/images/**/*.*", series(clearImg, moveImg));
    watch("src/vendors/**/**/**", series(clearVendors, moveVendors));
    watch("src/phps/*.*", series(clearPhp, movePhp));
}
exports.watch = watchFile;