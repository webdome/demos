// 文件 I/O 是由简单封装的标准 POSIX 函数提供。 通过 require('fs') 使用该模块。 所有的方法都有异步和同步的形式。

// 异步方法的最后一个参数都是一个回调函数。 传给回调函数的参数取决于具体方法，但回调函数的第一个参数都会保留给异常。 如果操作成功完成，则第一个参数会是 null 或 undefined。

// 当使用同步方法时，任何异常都会被立即抛出。 可以使用 try/catch 来处理异常，或让异常向上冒泡。

var fs = require("fs");

// 写入
// fs.writeFile('./data/a.txt', 'hello world', function(err) {
//   if (err) {
//     return console.log("读取错误:" + err);
//   }
//   console.log("写入成功");
// });

// 读取
// fs.readFile('./data/a.txt', /*'utf8',*/ function(err, data) {
//   if (err) {
//     throw err;
//   }
//   // 二进制16进制表现  toString默认参数为utf8  或者给readFile传入可选参数 内容编码格式
//   console.log(data);
//   console.log(data.toString());
// });

// 监听文件变化
// fs.watchFile('./data/a.txt', function(curr, prev) {
//   console.log(curr);
//   console.log(prev);
// });


// 打开写入
// fs.open('./data/a.txt', 'a', function(err, fd) {
//   if (err) {
//     throw err;
//   }
//   var data = '123123123 hello world';
//   var buf = new Buffer(data);
//   fs.write(fd, buf, 0, buf.length, 0, function(err, bytesWritten, buffer) {
//     if (err) {
//       throw err;
//     }
//     console.log(bytesWritten);
//     console.log(buffer);

//     fs.close(fd, function(err) {
//       if (err) {
//         throw err;
//       }
//       console.log('file closed');
//     })
//   })
// })
