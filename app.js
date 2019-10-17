var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var url = require('url');
var fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var readFile = require('./routes/router')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(function (request, response) {
  //获取客户端访问的路径
  var pathname = url.parse(request.url).pathname;
  //如果用户只输入域名就改变访问路径，并发送主页的内容给客户端
  if (pathname === "/") {
      pathname = "/index.html";
  }

  //判断文件是否存在
  fs.exists(__dirname + decodeURI(pathname), function (exists) {
      if (exists) {
          //使用readFile模块的函数
          readFile.readFileBySuffixName(pathname, fs, request, response);
      } else {
          //文件不存在，向客户端发送404状态码，并发送该文件不存在的字符串
          response.writeHead(404, {
              "Content-Type": "text/plain"
          });
          response.end(pathname + "文件不存在！");
      }
  });
});


module.exports = app;
