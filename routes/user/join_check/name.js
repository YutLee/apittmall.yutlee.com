var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mysql = require('mysql');
var cache = require('memory-cache');
var $db = require('../../../conf/db');
var jwtauth = require('../jwtauth');

/**
 * @api {post} /join_check/name checkUserName
 * @apiGroup User
 * @apiName checkUserName
 * @apiVersion 0.1.0
 *
 * @apiParam {String} value 邮箱地址
 *
 * @apiSuccess {Number} code 提示代码（200， 4001， 4002， 4003，4030）。
 * @apiSuccess {String} message 提示信息。
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 200,
 *      "message": "用户名可以使用"
 *  }
 *
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 4001,
 *      "message": "用户名不能为空"
 *  }
 *
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 4002,
 *      "message": "长度只能在6-20个字符之间"
 *  }
 *
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 4003,
 *      "message": "格式错误，仅支持汉字、字母、数字、“-”“_”的组合"
 *  }
 *  
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 4030,
 *      "message": "用户名已被使用"
 *  }
 *  
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 5000,
 *      "message": "服务器错误"
 *  }
 */
router.post('/', function(req, res, next) {
	var connection,
		name = (req.body.value || '').trim(),
		size = name.length;

	if(name == '') {
		res.status(200).json({code: 4001, message: '用户名不能为空'});
		return;
	}

	if(size < 4 || size > 20) {
		res.status(200).json({code: 4002, message: '长度只能在4-20个字符之间'});
		return;
	}

	if(/[^a-zA-Z0-9\u4E00-\u9FFF_-]/.test(name)) {//[\u4E00-\u9FFF]
		res.status(200).json({code: 4003, message: '格式错误，仅支持汉字、字母、数字、“-”“_”的组合'});
		return;
	}

	connection = mysql.createConnection($db.mysql);
	connection.query('select * from user_auths where identity_type="username" and identifier="' + name + '"', function(err, rows, fields) {
		if(err) {
			res.status(200).json({code: 5000, message: '服务器错误'});
			return;
		}

		if(rows && rows.length == 1) {
			// throw err;
			res.status(200).json({code: 4030, message: '用户名已被使用'});
		}else {
			res.status(200).json({code: 200, message: '用户名可以使用'});
		}
	});
});

module.exports = router;

