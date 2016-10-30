var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mysql = require('mysql');
var cache = require('memory-cache');
var $db = require('../../../conf/db');
var jwtauth = require('../jwtauth');

/**
 * @api {post} /join_check/mobile checkMobile
 * @apiGroup User
 * @apiName checkMobile
 * @apiVersion 0.1.0
 *
 * @apiParam {String} value 手机号码
 *
 * @apiSuccess {Number} code 提示代码（200， 4001， 4002， 4003，4030）。
 * @apiSuccess {String} message 提示信息。
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 200,
 *      "message": "手机号可以使用"
 *  }
 *
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 4001,
 *      "message": "手机号不能为空"
 *  }
 *
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 4003,
 *      "message": "手机号不正确"
 *  }
 *  
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 4030,
 *      "message": "手机号已被使用"
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
		mobile = (req.body.value || '').trim(),
		size = mobile.length;

	if(mobile == '') {
		res.status(200).json({code: 4001, message: '手机号不能为空'});
		return;
	}

	if(!/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(mobile)) {//[\u4E00-\u9FFF]
		res.status(200).json({code: 4003, message: '手机号不正确'});
		return;
	}

	connection = mysql.createConnection($db.mysql);
	connection.query('select * from user_auths where identity_type="mobile" and identifier="' + mobile + '"', function(err, rows, fields) {
		if(err) {
			res.status(200).json({code: 5000, message: '服务器错误'});
			return;
		}

		if(rows && rows.length == 1) {
			// throw err;
			res.status(200).json({code: 4030, message: '手机号已被使用'});
		}else {
			res.status(200).json({code: 200, message: '手机号可以使用'});
		}
	});
});

module.exports = router;

