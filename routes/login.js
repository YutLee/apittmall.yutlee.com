var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var jwtauth = require('./jwtauth');
var mysql = require('mysql');
var $db = require('../conf/db');

// 登录
router.get('/', jwtauth, function(req, res, next) {
	if(req.status == 401) {
		res.status(401).json({message: '需要身份认证'});
	}else {
		res.status(204).end();
	}
});

// 登录
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

