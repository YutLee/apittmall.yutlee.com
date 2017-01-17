var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var jwtauth = require('../user/jwtauth');
var mysql = require('mysql');
var cache = require('memory-cache');
var $db = require('../../conf/db');

/**
 * @api {post} /file Login
 * @apiGroup User
 * @apiName Login
 * @apiVersion 0.1.0
 *
 * @apiParam {String} name 文件名称
 * @apiParam {String} token
 * @apiParam {String} path 文件路径
 *
 * @apiSuccess {Number} code 提示代码（200， 4001， 4002， 4003）。
 * @apiSuccess {String} message 提示信息。
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 200,	//登录成功
 *      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAwMDAsInVzZXJfaWQiOjEwMDAwMDAwLCJpYXQiOjE0NzczNjc4ODAsImV4cCI6MTQ3NzM2OTY4MH0.tXoaawIr3Ln5rYFviAso0K9R9DPN_qe8AF2R-y1dwpU"
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
 *      "message": "密码不能为空"
 *  }
 *
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 4003,
 *      "message": "用户名或密码错误"
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
 */
router.post('/', jwtauth, function(req, res, next) {
	var connection, path, name, type;
	var decoded = req.tokenDecoded;
	const TIMEOUT = 1800;

	if(req.status == 401) {
		res.status(401).json({code: 401, message: '需要身份认证'});
		return;
	}

	if(req.status != 200) {
		res.status(200).json({code: 5000, message: '未知错误'});
		return;
	}

	if(req.body) {
		path = req.body.path;
		name = req.body.name;
		type = req.body.type;
		if(!path || path.trim() == '') {
			res.status(200).json({code: 4001, message: '文件路径不能为空'});
			return;
		}
		if(!name || name.trim() == '') {
			res.status(200).json({code: 4002, message: '文件名不能为空'});
			return;
		}
		if(!type || type.trim() == '') {
			res.status(200).json({code: 4003, message: '文件类型不能为空'});
			return;
		}
	}

	connection = mysql.createConnection($db.mysql);
	connection.query('select * from files where path="' + path + '" and name="' + name + '" and type="' + type + '"' + ' and user_id="' + decoded.id + '"', function(err, rows, fields) {
		if(err) {
			res.status(200).json({code: 500, message: '系统错误'});
			return;
		}

		if(rows && rows.length > 0) {
			res.status(200).json({code: 4004, message: '文件已存在'});
			return;
		}
		
		connection.query('INSERT INTO files (user_id, path, name, type) VALUES ("' + decoded.id + '", "' + path + '", "' + name + '", "' + type + '")', function(err, rows, fields) {
			if(err) {
				res.status(500).json({code: 500, message: '服务器错误'});
				return;
			}
			
			if(rows.insertId) {
				res.status(200).json({code: 200, file: {user_id: decoded.id, path: path, name: name, type: type}});
			}else {
				res.status(200).json({code: 4031, message: '新增文件失败'});
			}
		});
	});
});

module.exports = router;

