var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var jwtauth = require('./jwtauth');
var mysql = require('mysql');
var $db = require('../conf/db');

// 登录
router.get('/', jwtauth, function(req, res, next) {
	// res.render('login', { title: 'login' });
	if(req.status == 401) {
		res.status(401).json({message: '需要身份认证', documentation_url: 'http://docsttmall.yutlee.com'});
	}else {
		// res.render('login', { title: 'login' });
		res.status(200).end();
	}
});

// 登录
router.post('/', jwtauth, function(req, res, next) {
	// res.render('login', { title: 'login' });
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
		connection.query('SELECT * FROM users WHERE name="' + req.body.name + '"', function(err, rows, fields) {
			if(err) {
				// throw err;
				res.status(200).json({message: '用户名或密码错误'});//better 401?
				return;
			}
			
			if(!rows[0] || !rows[0].uuid) {
				res.status(200).json({message: '用户名或密码错误'});
				return;
			}
			
			connection.query('SELECT * FROM user_auths WHERE user_id="' + rows[0].uuid + '" and credential="' + req.body.pass + '"', function(err, rows, fields) {
				if(err) {
					// throw err;
					res.status(200).json({message: '用户名或密码错误'});//better 401?
					return;
				}
				
				if(!rows[0]) {
					res.status(200).json({message: '用户名或密码错误'});
					return;
				}

				var token = jwt.sign({ uuid: rows[0].user_id }, 'access_token', {expiresIn: '7d'});
				res.cookie('access_token', token, { maxAge: 7 * 24 * 3600000, httpOnly: true });
				res.status(200).json({message: '登录成功'});
			});
		});
	}else {
		// res.render('login', { title: 'login' });
		res.status(200).end();
	}

});

module.exports = router;

