//     ┏┓     ┏┓
//    ┏┛┻━━━━━┛┻┓
//    ┃         ┃
//    ┃    ━    ┃
//    ┃  ┳┛ ┗┳  ┃
//    ┃         ┃
//    ┃    ┻    ┃
//    ┃         ┃
//    ┗━┓     ┏━┛
//      ┃     ┃
//      ┃     ┃
//      ┃     ┗━━━━━┓
//      ┃           ┣┓
//      ┃           ┏┛
//      ┗┓┓┏━━━━━┳┓┏┛
//       ┃┫┫     ┃┫┫
//       ┗┻┛     ┗┻┛
//   神兽保佑 永无BUG

// 处理http协议 错误
var createError = require('http-errors');

// express 使用各种中间件  路由
var express = require('express');

// 生成路径
var path = require('path');

// 解析cookie   
// http  请求的时候  带着 浏览器的cookie  到服务器
var cookieParser = require('cookie-parser');

// http请求的日志
var logger = require('morgan');

// 配置路由
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//管理员
var adminRouter = require('./routes/admin');
//获取评论路由模块
var commentRouter = require('./routes/comment');

var app = express();
// dadadsf

// view engine setup  模板引擎
// 设置模板文件 存放目录
app.set('views', path.join(__dirname, 'views'));
// 设置  模板引擎 类型  ejs
app.set('view engine', 'ejs');

app.use(logger('dev'));
// 解析json
app.use(express.json());
// 解析请求body
app.use(express.urlencoded({
  extended: false
}));
// 解析cookie
app.use(cookieParser());

// 配置静态资源路径 中间件
// __dirname  全局变量   得到当前文件所在的目录
console.log(path.join(__dirname, 'public'));
// c:\Users\jameswatt\Desktop\cz18\node-3\blog\public
app.use(express.static(path.join(__dirname, 'public')));

//会话支持
// npm i connect-mongo -S
// npm i connect-mongo@0.8.2 -S
var session = require('express-session');
var MongoStore = require('connect-mongo')(session)

app.use(session({
  secret: 'recommend 128 bytes random string', //对session id 相关的cookie 进行签名
  cookie: {
    maxAge: 365*24*60 * 60 * 1000
  },
  // 设置 session 的有效时间，单位毫秒
  resave: true, ////重新保存：强制会话保存即使是未修改的。默认为true但是得写上
  saveUnintialized: true, //// 是否保存未初始化的会话,
  store: new MongoStore(
    {
      db:'czblog',
      host:'localhost',
      port:27017
    }
  )
  
}));


//图文混排中间件
var ueditor = require("ueditor");
// /ueditor 入口地址配置 https://github.com/netpi/ueditor/blob/master/example/public/ueditor/ueditor.config.js
// 官方例子是这样的 serverUrl: URL + "php/controller.php"
// 我们要把它改成 serverUrl: URL + 'ue'
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {

  // ueditor 客户发起上传图片请求

  if(req.query.action === 'uploadimage') {

    // 这里你可以获得上传图片的信息
    var foo = req.ueditor;
    console.log(foo.filename); // exp.png
    console.log(foo.encoding); // 7bit
    console.log(foo.mimetype); // image/png

    // 下面填写你要把图片保存到的路径 （ 以 path.join(__dirname, 'public') 作为根路径）
    var img_url = '/images/ue';
    console.log(img_url)
    res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
  }
  // 客户端发起图片列表请求
  else if(req.query.action === 'listimage') {
    var dir_url = '/images/ue'; // 要展示给客户端的文件夹路径
    res.ue_list(dir_url) // 客户端会列出 dir_url 目录下的所有图片
  }
  // 客户端发起其它请求
  else {

    res.setHeader('Content-Type', 'application/json');
    // 这里填写 ueditor.config.json 这个文件的路径
    res.redirect('/ueditor/ueditor.config.json')
    
  }
}));



//配置了上传图片的中间件
var multer = require('multer');
var fs = require("fs");
//{ dest: '/tmp/'} 图片上传的临时目录
// image  上传表单的 name 字段 
app.use(multer({ dest: '/tmp/'}).array('image'));




// 配置路径
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/comment', commentRouter);
app.use('/admin', adminRouter);






// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //渲染了error 模板
  res.render('error');
});

module.exports = app;