var jwt = require('jsonwebtoken');
var mysql = require('mysql');
var $db = require('../conf/db');

module.exports = function(req, res, next) {
	// res.set('Content-Type', 'application/json;charset=utf-8');
  	var token = (req.cookies && req.cookies.access_token) || req.headers['x-access-token'] || (req.body && req.body.access_token) || (req.query && req.query.access_token);

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
		connection.query('select * from users where id=' + decoded.user_id, function(err, rows, fields) {
			if(err) {
				// throw err;
				req.status = 401;
			}else {
			 	req.status = 200;
			 	token = jwt.sign({ user_id: decoded.user_id }, 'access_token', {expiresIn: '7d'});
				res.cookie('access_token', token, { maxAge: 7 * 24 * 3600000});
			}
		 	next();
		});
	} else {
		req.status = 401;
		next();
	}	
};

