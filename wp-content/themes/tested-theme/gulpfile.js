const gulp = require("gulp")
const sass = require("gulp-sass")
const clean_css = require("gulp-clean-css")
const rename = require("gulp-rename")
const uglify = require("gulp-terser")
const concat = require("gulp-concat")
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require("gulp-plumber")
const browsersync = require("browser-sync").create()
const puppeteer = require("puppeteer")
const phpunit = require("gulp-phpunit")
const axios = require("axios")
const _size = "gulp-size";
const size = require(_size);

const {Page,Browser} = puppeteer;

const _browserSyncProxy = "http://127.0.0.1/";
let browserSyncProxy = _browserSyncProxy;
exports.browserSyncProxy = browserSyncProxy;

//createProxyWithPath
function _createProxyWithPath(path){

    if(path){
        if(path.charAt(0) == "/"){
            path = path.slice(1,path.length)
        }

        return browserSyncProxy+path;
    }else{
        return browserSyncProxy;
    }

}
const createProxyWithPath = _createProxyWithPath;
exports.createProxyWithPath = createProxyWithPath;
//createProxyWithPath

// This task compiles SASS to css with autoprefixer enabled, generates sourcemaps and minifies to the dist/css directory
gulp.task("sass",()=>{
    return gulp.src("src/sass/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write({includeContent:false}))
        .pipe(sourcemaps.init({loadMaps:true}))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(rename("style.css"))
        .pipe(clean_css())
        .pipe(size())
        .pipe(gulp.dest("./dist/css"))
        .pipe(browsersync.stream())
})

//This task concatenates all Javascript source file not including the libraries used to the dist/js directory
gulp.task('js_src', () => {
    return gulp.src("src/js/*.js")
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest("./dist/js"))
        .pipe(browsersync.stream())
})

gulp.task('js_lib', () => {
    return gulp.src([
        "node_modules/gsap/umd/TimelineMax.js",
        "node_modules/gsap/umd/TweenMax.js",
        "node_modules/jquery/dist/jquery.js",
        "node_modules/scrollmagic/scrollmagic/minified/ScrollMagic.min.js",
        "node_modules/scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js",
        "node_modules/scrollmagic/scrollmagic/minified/plugins/jquery.ScrollMagic.min.js",
    ])
        .pipe(uglify())
        .pipe(gulp.dest("./dist/js"))
        .pipe(browsersync.stream())
})

//This task is called with the gulp keyword
gulp.task('serve',()=>{

    gulp.watch("src/sass/*.scss",gulp.series("sass"))
    gulp.watch("src/js/*.js",gulp.series("js_src"))

    gulp.watch("./*.php").on('change', browsersync.reload);
    gulp.watch("./src/*.php").on('change', browsersync.reload);
})

//This task runs PHP tests
gulp.task('phpunit', async function() {
    const options = {debug: false};
    await gulp.src('./phpunit.xml')
        .pipe(phpunit('.\\vendor\\bin\\phpunit',options, (err,msg) => {
            console.log(`${err} - ${msg}`)
        }));
});

// //Launches new Puppeteer Browser
gulp.task('puppeteer', async () => {
    await initializePuppeteer();
})

//initializePuppeteer
async function _initializePuppeteer(){
    const _puppeteer = await puppeteer.launch({
        headless : false,
        slowMo : 200,
        ignoreHTTPSErrors: true,
        // devtools: true,
        args : [
            '--remote-debugging-port=9090'
        ]
    })
    return _puppeteer;

}
const initializePuppeteer = _initializePuppeteer;
exports.initializePuppeteer = initializePuppeteer;
//initializePuppeteer

//createBrowserSync
async function _createBrowserSync(){
    await browsersync.init({
        proxy : createProxyWithPath('-development'),
        open: false
    });
}
const createBrowserSync = _createBrowserSync;
exports.createBrowserSync = createBrowserSync;
//createBrowserSync

//createPuppeteer
async function _connectLocalPuppeteer(){
    const debuggerUrl = await getWebSockDebuggerUrl();
    const browser = await puppeteer.connect({browserWSEndpoint : debuggerUrl,ignoreHTTPSErrors:true});
    return browser;
}
const connectLocalPuppeteer = _connectLocalPuppeteer;
exports.connectLocalPuppeteer = connectLocalPuppeteer;
//createPuppeteer

//createIncognitoContext
async function _createIncognitoContext(){
    const browser = await connectLocalPuppeteer();
    const context = await browser.createIncognitoBrowserContext();
    return context;
}
const createIncognitoContext = _createIncognitoContext;
exports.createIncognitoContext = createIncognitoContext;
//createIncognitoContext

//createPage
async function _createPage(url,device, incognitoContext = undefined){
    const browser = await connectLocalPuppeteer();
    const page = incognitoContext === undefined ? await browser.newPage() : await incognitoContext.newPage();

    if(device)
        await page.emulate(puppeteer.devices[device]);

    if(url)
        await page.goto(url);

    return page;
}
const createPage = _createPage;
exports.createPage = createPage;
//createPage

//getWebSockDebuggerUrl
async function _getWebSockDebuggerUrl(){
    const response = await axios.get('http://localhost:9090/json/version')
    const {webSocketDebuggerUrl} = response.data;
    return webSocketDebuggerUrl;
}
const getWebSockDebuggerUrl = _getWebSockDebuggerUrl;
exports.getWebSockDebuggerUrl = getWebSockDebuggerUrl;
//getWebSockDebuggerUrl

gulp.task("live-edit",async ()=>{
    await createBrowserSync();
    await connectLocalPuppeteer();

    const _browserSyncUrl = "http://localhost:3000/-development/";
    let browserSyncUrl = _browserSyncUrl;
    const _incognitoContext = await createIncognitoContext();
    //
    await createPage(browserSyncUrl,"Galaxy S5",_incognitoContext);
    await createPage(browserSyncUrl,"iPad",_incognitoContext);
    await createPage(browserSyncUrl,undefined,_incognitoContext);
})

gulp.task("default",gulp.series("puppeteer","live-edit","sass","js_src","js_lib","serve"))
