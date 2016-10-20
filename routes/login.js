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
 *
 * @apiParam {String} name Users name.
 * @apiParam {String} pass Users password.
 *
 * @apiSuccess {String} message Message of login.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "success"
 *     }
 *
 * @apiError NotFound The method of the login was wrong.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Not Found"
 *     }
 */
router.put('/', jwtauth, function(req, res, next) {
	var connection;

	if(req.status == 401) {
		if(!req.body || !req.body.name || req.body.name.trim() == '') {
			res.status(200).json({message: '用户名不能为空'});
			return;
		}
		if(!req.body || !req.body.pass || req.body.pass.trim() == '') {
			res.status(200).json({message: '密码不能为空'});
			return;
		}
		
		connection = mysql.createConnection($db.mysql);
		connection.query('select * from user_auths where identifier="' + req.body.name + '" and credential="' + req.body.pass + '"', function(err, rows, fields) {
			if(err) {
				// throw err;
				res.status(200).json({message: '用户名或密码错误'});//better 401?
				return;
			}
			
			var token = jwt.sign({ user_id: rows[0].user_id }, 'access_token', {expiresIn: '7d'});
			// res.cookie('access_token', token, { maxAge: 7 * 24 * 3600000, httpOnly: true });
			res.cookie('access_token', token, { maxAge: 7 * 24 * 3600000 });
			res.status(200).json({message: '登录成功'});
		});
	}else {
		res.status(200).json({message: '登录成功'});
	}

});

module.exports = router;

