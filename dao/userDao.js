// 实现与MySQL交互
var mysql = require('mysql');
var $db = require('../conf/db');
// var $util = require('../util/util');
var $sql = require('./userSqlMapping');
 
// 使用连接池，提升性能
// var pool  = mysql.createPool($util.extend({}, $db.mysql));

var connection = mysql.createConnection($db.mysql);
 
// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
	if(typeof ret === 'undefined') {
		res.json({
			code:'1',
			msg: '操作失败'
		});
	} else {
		res.json(ret);
	}
};
 
module.exports = {
	add: function (req, res, next) {
		connection.query('SELECT * FROM USERS', function(err, rows, fields) {
			if (err) throw err;
		 	console.log(rows[0]);
		 	res.send('Hello');
		});
 
	}
};