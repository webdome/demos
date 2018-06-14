var qs = require('querystring');
var mysql = require('mysql');

var sql = require('./sql.js');
var Util = require('./util.js');

var connection = mysql.createConnection({
  host: 'localhost',
  // port: '3306',
  user: 'root',
  password: '100912',
  database: 'testdb'
});
// 连接
connection.connect();
//关闭连接
// connection.end();

var ACT = {
  // 获取用户信息
  getUserMsg: function(req, res) {
    var postData = "";
    /**
     * 因为post方式的数据不太一样可能很庞大复杂，
     * 所以要添加监听来获取传递的数据
     * 也可写作 req.on("data",function(data){});
     */
    req.addListener("data", function(data) {
      postData += data;
    });
    /**
     * 这个是如果数据读取完毕就会执行的监听方法
     */
    req.addListener("end", function() {
      var query = qs.parse(postData);
      //查询
      connection.query(sql.getUserMsg(query.id), function(err, rows, fields) {
        if (err) throw err;
        // console.log('查询结果为: ', rows);
        Util.writeOut(rows[0], res);
      });
    });
  },
  // 用户注册
  register: function(req, res) {
    var postData = "";
    req.addListener("data", function(data) {
      postData += data;
    });
    req.addListener("end", function() {
      var query = qs.parse(postData);
      //查询
      connection.query(sql.register(query.username, query.sex, query.age, query.email), function(err, rows, fields) {
        if (err) throw err;
        // console.log('查询结果为: ', rows);
        Util.writeOut(rows, res);
      });
    });
  }
};

module.exports = ACT;