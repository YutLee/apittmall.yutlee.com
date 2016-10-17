var jwt = require('jsonwebtoken');
var mysql = require('mysql');
var $db = require('../conf/db');

module.exports = function(req, res, next) {
	// res.set('Content-Type', 'application/json;charset=utf-8');
  	var token = (req.cookies && req.cookies.access_token) || req.headers['x-access-token'] || (req.body && req.body.access_token) || (req.query && req.query.access_token);
  	console.log(token);

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
    	console.log(decoded.uuid);
		var connection = mysql.createConnection($db.mysql);
		connection.query('SELECT * FROM users WHERE uuid=' + decoded.uuid, function(err, rows, fields) {
			if(err) {
				// throw err;
				req.status = 401;
			}else {
			 	req.status = 200;
			 	token = jwt.sign({ uuid: decoded.uuid }, 'access_token', {expiresIn: '7d'});
				res.cookie('access_token', token, { maxAge: 7 * 24 * 3600000, httpOnly: true });
			}
		 	next();
		});
	} else {
		req.status = 401;
		next();
	}	
};

