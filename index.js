let Koa=require('koa');
let path=require('path');
let bodyParser = require('koa-bodyparser');
let session = require('koa-session-minimal');
let MysqlStore = require('koa-mysql-session');
let config = require('./config/commonConfig.js');
//解决跨域，改了下源码，让OPTIONS预检请求返回由204变为200
let cors = require('koa-cors');
// let router=require('koa-router');
// 注意require('koa-router')返回的是函数,()是函数调用
const router = require('koa-router')();
let app=new Koa();
app.use(cors());
//跨域也可以这么解决
// app.use(async function(ctx, next) {
//     ctx.set("Access-Control-Allow-Origin", '*');
//     ctx.set("Access-Control-Allow-Credentials", true);
//     //设置让OPTIONS通过
//     ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
//     ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
//     await next()
// });
// session存储配置
const sessionMysqlConfig= {
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST,
};
// 配置session中间件,没有这个登录操作不能成功
app.use(session({
    key: 'USER_SID',
    store: new MysqlStore(sessionMysqlConfig)
}));
//由于middleware的顺序很重要，这个koa-bodyparser必须在router之前被注册到app对象上
//bodyParser可以解析post请求的表单，从而在对应的路由上可以用ctx.request.body获取
app.use(bodyParser());
//每收到一个http请求，koa就会调用通过app.use()注册的async函数，并传入ctx和next参数。
//用await next()来调用下一个async函数。我们把每个async函数称为middleware，
// 这些middleware可以组合起来，完成很多有用的功能
//注册和登录路由
app.use(require('./routers/login/login.js').routes());
app.use(require('./routers/login/register.js').routes());
app.use(require('./routers/login/signout.js').routes());
//发表文章的路由
app.use(require('./routers/blog/publish.js').routes());
//获取文章列表的路由，可以根据标签获取，传入对应的标签即可
app.use(require('./routers/blog/bloglist.js').routes());
//获取所有标签的路由，不区分大小写labellist===labelList
app.use(require('./routers/blog/labellist.js').routes());


app.listen(8080);
console.log('listening on port'+ config.port)
