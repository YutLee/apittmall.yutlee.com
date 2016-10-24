var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
 //  	var jwt = require('jsonwebtoken');
	// var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
	// //backdate a jwt 30 seconds
	// var older_token = jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 }, 'shhhhh');
	// console.log(token == older_token);
	// // // sign with RSA SHA256
	// // var cert = fs.readFileSync('private.key');  // get private key
	// // var token = jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256'});

	// // // sign asynchronously
	// // jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256' }, function(err, token) {
	// //   console.log(token);
	// // });
	// var decoded = jwt.verify(token, 'shhhhh');
	// console.log(decoded, decoded.foo) // bar
  	// res.render('index', { title: 'Express' });
  	res.status(200).end('{\r\n  "current_user_url": "http://apittmall.yutlee.com/user",\r\n  "current_user_authorizations_html_url": "http://apittmall.yutlee.com/settings/connections/applications{/client_id}"\r\n}');
});

module.exports = router;
