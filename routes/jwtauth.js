var jwt = require('jsonwebtoken');
var mysql = require('mysql');
var $db = require('../conf/db');

module.exports = function(req, res, next) {
	// res.set('Content-Type', 'application/json;charset=utf-8');
  	var token = (req.cookies && req.cookies.access_token) || req.headers['x-access-token'] || (req.body && req.body.access_token) || (req.query && req.query.access_token);
  	// var token = req.session.access_token || null;

	if(token) {
		var decoded;
		try{
	    	decoded = jwt.verify(token, 'access_token');
	    }catch(err) {
	    	req.status = 401;
    		next();
	    }

    	if(!decoded) {
    		req.status = 401;
    		next();
    		return;
    	}
    	
		var connection = mysql.createConnection($db.mysql);
		// connection.query('select * from users where id=' + decoded.user_id, function(err, rows, fields) {
		connection.query('select * from user_auths where id="' + decoded.id + '"', function(err, rows, fields) {
			if(err || (rows && rows.length <= 0)) {
				// throw err;
				req.status = 401;
			}else {
			 	token = jwt.sign({ id: rows[0].id, user_id: rows[0].user_id }, 'access_token', {expiresIn: 1800});
				res.cookie('access_token', token, { maxAge: 1800 * 1000});
			 	req.status = 200;
			 	req.token = token;
			}
		 	next();
		});
	} else {
		req.status = 401;
		next();
	}	
};

