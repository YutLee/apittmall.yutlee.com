var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var jwtauth = require('./jwtauth');
var mysql = require('mysql');
var $db = require('../conf/db');

/**
 * @api {put} /login login
 * @apiGroup User
 * @apiName Login
 * @apiVersion 0.1.0
 *
 * @apiParam {String} access_token 登录成功后的token值
 *
 * @apiSuccess {Number} code 提示代码（200， 4001）。
 * @apiSuccess {String} message 提示信息。
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 200,	//登出成功
 *  }
 *
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 4001,
 *      "message": "未登录"
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
router.delete('/', jwtauth, function(req, res, next) {
	if(req.status == 200) {
		var decoded;
		try{
	    	decoded = jwt.verify(req.token, 'access_token');
			jwt.sign({ id: decoded.id, user_id: decoded.user_id, exp: Math.floor(Date.now() / 1000) - 30}, 'access_token');
			// res.cookie('access_token', token, { maxAge: 1800 * 1000 });
			res.status(200).json({code: 200});
	    }catch(err) {
	    	res.status(200).json({code: 4001, message: '未登录'});
	    }
	}else {
		res.status(200).json({code: 4001, message: '未登录'});
	}
});

module.exports = router;

