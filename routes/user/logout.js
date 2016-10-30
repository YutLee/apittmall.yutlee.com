var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var jwtauth = require('./jwtauth');
var mysql = require('mysql');
var cache = require('memory-cache');
var $db = require('../../conf/db');

/**
 * @api {delete} /logout Logout
 * @apiGroup User
 * @apiName Logout
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
 *      "code": 200,
 *      "message": "退出成功"
 *  }
 *
 * @apiError {Number} code 提示代码。
 * @apiError {String} message 提示信息。
 *
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 401 OK
 *  {
 *      "code": 401,
 *      "message": "需要身份认证"
 *  }
 *  
 *  HTTP/1.1 404 Not Found
 *  {
 *      "code": 404,
 *      "message": "请求页面不存在"
 *  }
 */
router.delete('/', jwtauth, function(req, res, next) {
	if(req.status == 200) {
		var decoded = req.tokenDecoded;
		cache.del('access_token_last_' + decoded.id);
		cache.del('access_token_' + decoded.id);
		res.status(200).json({code: 200, message: '退出成功'});
	}else {
		res.status(401).json({code: 401, message: '需要身份认证'});
	}
});

module.exports = router;

