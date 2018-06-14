/*导入需要用到的nodejs库*/
var http = require('http');
var url = require('url');
/*导入需要的工具库*/
var Util = require('./util/util.js');


/**
 * 启用http创建一个端口为8080的服务
 * createServer内侧为回调函数：
 * ...可看作java servlet中的 onService(HttpRequest,HttpResponse)
 * ...或者（doGet、doPost）
 */
http.createServer(function(req, res) {
  var pathname = url.parse(req.url).pathname;
  Util.log(pathname);
  res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8', 'Access-Control-Allow-Origin': '*' });
  // if (req.method.toUpperCase() == 'POST') {
  if (pathname === '/login') {
    Util.writeOut('ok', res);
  } else {
    Util.log('404: function is not found');
    Util.writeOut('404: function is not found', res);
  }
  // } else if (req.method.toUpperCase() == 'GET') {
  /**
   * 也可使用var query=qs.parse(url.parse(req.url).query);
   * 区别就是url.parse的arguments[1]为true：
   * ...也能达到‘querystring库’的解析效果，而且不使用querystring
   */
  // var query = url.parse(req.url, true).query;
  // writeOut(query, res);
  // } else {
  //head put delete options etc.
  // }

}).listen(8030, function() {
  console.log("listen on port 8030");
});