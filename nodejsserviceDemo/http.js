var http = require("http");
var fs = require("fs");

var server = http.createServer();

var handleRequest = function(request, response) {
  var url = request.url;
  console.log("请求路径：" + url);
  if (url === '/') {
    response.writeHead(200, {
      'Content-Type': 'text/html'
    });
    fs.readFile('./data/index.html', 'utf8', function(err, data) {
      if (err) {
        throw err;
      }
      response.end(data);
    });
  } else if (url === '/login') {
    response.writeHead(200, {
      'Content-Type': 'text/html'
    });
    fs.readFile('./data/login.html', 'utf8', function(err, data) {
      if (err) {
        throw err;
      }
      response.end(data);
    });
  } else if (url === '/register') {
    response.writeHead(200, {
      'Content-Type': 'text/html'
    });
    fs.readFile('./data/register.html', 'utf8', function(err, data) {
      if (err) {
        throw err;
      }
      response.end(data);
    });
  } else if (url === '/css/main.css') {
    response.writeHead(200, {
      'Content-Type': 'text/css'
    });
    fs.readFile('./data/css/main.css', 'utf8', function(err, data) {
      if (err) {
        throw err;
      }
      response.end(data);
    });
  } else {
    response.writeHead(200, {
      'Content-Type': 'text/html'
    });
    fs.readFile('./data/404.html', 'utf8', function(err, data) {
      if (err) {
        throw err;
      }
      response.end(data);
    });
  }


}

server.on("request", handleRequest);

server.listen(8080, function() {
  console.log("Server is running at port 8080");
});