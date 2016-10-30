var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mysql = require('mysql');
var $db = require('../../conf/db');

/**
 * @api {post} /join Join
 * @apiGroup User
 * @apiName Join
 * @apiVersion 0.1.0
 *
 * @apiParam {String} username 登录名（用户名/邮箱/手机号）
 * @apiParam {String} password 密码
 * @apiParam {String} repassword 重复密码
 * @apiParam {String} captcha 验证码
 *
 * @apiSuccess {Number} code 提示代码（200， 4001， 4002， 4003）。
 * @apiSuccess {String} message 提示信息。
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 200,	//注册成功
 *      "user_auths": {
 *          "user_id": 10000019,
 *          "identity_type": "username",
 *          "identifier": "test1",
 *          "credential": "123456"
 *      }
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
 *      "message": "长度只能在4-20个字符之间"
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
 *      "code": 4004,
 *      "message": "密码不能为空"
 *  }
 *
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 4005,
 *      "message": "长度只能在6-20个字符之间"
 *  }
 *
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 4006,
 *      "message": "重复密码不能为空"
 *  }
 *
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 4007,
 *      "message": "两次密码输入不一致"
 *  }
 *
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 4008,
 *      "message": "验证码不能为空"
 *  }
 *
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 4009,
 *      "message": "验证码不正确"
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
 *      "code": 40031,
 *      "message": "注册失败"
 *  }
 *
 * @apiError {Number} code 提示代码。
 * @apiError {String} message 提示信息。
 *
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 404 Not Found
 *  {
 *      "code": 404,
 *      "message": "请求页面不存在"
 *  } 
 *  
 *  HTTP/1.1 500
 *  {
 *      "code": 500,
 *      "message": "服务器错误"
 *  }
 */
router.post('/', function(req, res, next) {
	var connection;
	var username = (req.body.username || '').trim(),
		password = (req.body.password || '').trim(),
		repassword = (req.body.repassword || '').trim(),
		captcha = (req.body.captcha || '').trim().toLowerCase(),
		nameSize = username.length,
		passwordSize = password.length,
		repasswordSize = repassword.length;

	if(username == '') {
		res.status(200).json({code: 4001, message: '用户名不能为空'});
		return;
	}

	if(nameSize < 4 || nameSize > 20) {
		res.status(200).json({code: 4002, message: '长度只能在4-20个字符之间'});
		return;
	}

	if(/[^a-zA-Z0-9\u4E00-\u9FFF_-]/.test(username)) {//[\u4E00-\u9FFF]
		res.status(200).json({code: 4003, message: '格式错误，仅支持汉字、字母、数字、“-”“_”的组合'});
		return;
	}

	if(password == '') {
		res.status(200).json({code: 4004, message: '密码不能为空'});
		return;
	}

	if(passwordSize < 6 || passwordSize > 20) {
		res.status(200).json({code: 4005, message: '长度只能在6-20个字符之间'});
		return;
	}

	if(repassword == '') {
		res.status(200).json({code: 4006, message: '重复密码不能为空'});
		return;
	}

	if(password !== repassword) {
		res.status(200).json({code: 4007, message: '两次密码输入不一致'});
		return;
	}

	if(captcha == '') {
		res.status(200).json({code: 4008, message: '验证码不能为空'});
		return;
	}

	if(captcha !== req.session.captcha) {
		res.status(200).json({code: 4009, message: '验证码不正确'});
		return;
	}

	req.session.captcha = null;
	 
	var savePassword = jwt.sign({ password: password }, 'password', {noTimestamp: true});

	connection = mysql.createConnection($db.mysql);
	connection.query('select * from user_auths where identity_type="username" and identifier="' + username + '"', function(err, rows, fields) {
		if(err) {
			res.status(500).json({code: 500, message: '服务器错误'});
			return;
		}

		if(rows && rows.length == 1) {
			// throw err;
			res.status(200).json({code: 4030, message: '用户名已被使用'});
		}else {
			connection.query('INSERT INTO users VALUES ()', function(err, rows, fields) {
				if(err) {
					res.status(500).json({code: 500, message: '服务器错误'});
					return;
				}
				var userId = (rows && rows.insertId) || '';
				if(userId) {
					connection.query('INSERT INTO user_auths (user_id, identity_type, identifier, credential) VALUES ("' + userId + '", "username", "' + username + '", "' + savePassword + '")', function(err, rows, fields) {
						if(err) {
							res.status(500).json({code: 500, message: '服务器错误'});
							return;
						}

						if(rows.insertId) {
							res.status(200).json({code: 200, user_auths: {user_id: userId, identity_type: 'username', identifier: username, credential: password}});
						}else {
							res.status(200).json({code: 4031, message: '注册失败'});
						}

					});
				}else {
					res.status(200).json({code: 4031, message: '注册失败'});
				}
			});
		}
	});
});

module.exports = router;

