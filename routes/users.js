var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

var userDao = require('../dao/userDao');
// 增加用户
router.get('/addUser', function(req, res, next) {
	userDao.add(req, res, next);
	// var data = {};
	// res.writeHead(200, {'Content-Type': 'application/json'});
	// res.writeHead(200, {'Content-Type': 'text/html'});
	// console.log(req.query);
	// res.send(res.toString());
	// res.end();
 	// res.render('updateUser', { title: 'updateUser' });
});

module.exports = router;

