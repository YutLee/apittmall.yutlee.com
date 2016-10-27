var express = require('express');
var router = express.Router();
var svgCaptcha = require('svg-captcha');
 
router.post('/', function (req, res, next) {
    var text = svgCaptcha.randomText();
    var captcha = svgCaptcha(text);
    req.session.captcha = text.toLowerCase();

    // console.log(captcha);
    // res.set('Content-Type', 'image/svg+xml;charset=utf-8');
    res.status(200).send(captcha);
});

module.exports = router;

