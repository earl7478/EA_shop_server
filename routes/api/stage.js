var express = require('express');
var router = express.Router();
var db = require('../../db')
// 加密模块
var crypto = require('crypto');
// 注册/登录session
var session = require('express-session');

// 用户注册
router.post('/register', function (req, res, next) {
    let md5 = crypto.createHash('md5');
    let createTime = new Date();
    let user_password = md5.update(req.body.user_password).digest('hex')
    var sqlStr = `insert into user_list values(null,'${req.body.user_name}','${user_password}','','','',0,0,'${createTime}','');`;
    db.query(sqlStr, '', (err, result) => {
        if (err) {
            res.end(returnResult(400, 'Failed'))
        } else { // 注册成功
            res.end(returnResult(200, 'Success'))
        }
    })
})


// 用户登录
router.post('/login', function (req, res, next) {
    let md5 = crypto.createHash('md5');
    let userName = req.body.user_name;
    let userPassword = md5.update(req.body.user_password).digest('hex')
    var sqlStr = `select * from user_list where user_name='${userName}';`;
    db.query(sqlStr, '', (err, result) => {
        if (err) {
            res.end(returnResult(1, 'Failed, can\'t found user name！'))
        } if (result) {
            if (userPassword === result.userPassword && userName === result.user_name) {
                req.session.userInfo = result //注入session
                res.end(returnResult(0, 'Success'))
            } else {
                res.end(returnResult(2, 'Failed'))
            }
        }
    })
});




// public Function
function returnResult(code, msg, obj = {}) {
    let returnResult = {};
    returnResult = {
        code: code,
        msg: msg,
        more: obj
    }
    return JSON.stringify(returnResult);
}

module.exports = router;