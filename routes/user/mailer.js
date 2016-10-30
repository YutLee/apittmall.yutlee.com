var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/**
 * @api {post} /mailer Mailer
 * @apiGroup User
 * @apiName Mailer
 * @apiVersion 0.1.0
 *
 * @apiParam {String} access_token 登录成功后的token值
 *
 * @apiSuccess {Number} code 提示代码（200， 5001）。
 * @apiSuccess {String} message 提示信息。
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 200,
 *      "message": "邮件已发送"
 *  }
 *  
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 5001,
 *      "message": "邮件发送失败"
 *  }
 */
router.post('/', function(req, res, next) {
	// 开启一个 SMTP 连接池
	var smtpTransport = nodemailer.createTransport({
		host: 'smtp.163.com', // 主机
		secure: true, // 使用 SSL
		port: 465, // SMTP 端口
		auth: {
			user: 'yutlee@163.com', // 账号
			pass: 'ytLee163smtp53' // qq授权码:"wgjvgpmbrnpqbbcc" // 密码
	  	}
	});

	var mailOptions = {
		from: '"Fred Foo 👥" <yutlee@163.com>', // sender address 
	    to: 'yutlee@foxmail.com', // list of receivers 
	    subject: 'Hello ✔', // Subject line 
	    text: 'Hello world 🐴', // plaintext body 
	    html: '<b>Hello world 🐴</b>' // html body 
	};
	 
	// send mail with defined transport object 
	smtpTransport.sendMail(mailOptions, function(error, info){
	    if(error){
	    	res.status(200).json({code: 5001, message: '邮件发送失败'});
	        return console.log(error);
	    }
	    res.status(200).json({code: 200, message: '邮件已发送'});
	    // console.log('Message sent: ' + info.response);
	});
});

module.exports = router;

