var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mysql = require('mysql');
var cache = require('memory-cache');
var $db = require('../../../conf/db');
var jwtauth = require('../jwtauth');

/**
 * @api {post} /join_check/email checkEmail
 * @apiGroup User
 * @apiName checkEmail
 * @apiVersion 0.1.0
 *
 * @apiParam {String} value 邮箱地址
 *
 * @apiSuccess {Number} code 提示代码（200， 4001， 4002， 4003）。
 * @apiSuccess {String} message 提示信息。
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 200,
 *      "message": "邮箱地址可以使用"
 *  }
 *
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 4001,
 *      "message": "邮箱地址不能为空"
 *  }
 *
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 4002,
 *      "message": "邮箱地址不正确"
 *  }
 *
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 4030,
 *      "message": "邮箱地址已被使用"
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
		email = (req.body.value || '').trim();

	if(email == '') {
		res.status(200).json({code: 4001, message: '邮箱地址不能为空'});
		return;
	}

	if(!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)) {
		res.status(200).json({code: 4002, message: '邮箱地址不正确'});
		return;
	}

	connection = mysql.createConnection($db.mysql);
	connection.query('select * from user_auths where identity_type="email" and identifier="' + email + '"', function(err, rows, fields) {
		if(err) {
			res.status(200).json({code: 5000, message: '服务器错误'});
			return;
		}

		if(rows && rows.length == 1) {
			// throw err;
			res.status(200).json({code: 4030, message: '邮箱地址已被使用'});
		}else {
			res.status(200).json({code: 200, message: '邮箱地址可以使用'});
		}
	});
});

module.exports = router;

