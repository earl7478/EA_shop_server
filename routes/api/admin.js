var express = require('express');
var router = express.Router();
var db = require('../../db')
var session = require('express-session');

//相当于后台的路由，所有的后台处理都需要从这里经过
router.use(function (req, res, next) {
    // const currPath = req.url;
    if (req.session) {
        if (req.session.userinfo && req.session.userinfo.admin_user && req.session.userinfo.admin_id) {
            next();
        }
    } else {
        //console.log("—————————2———————路过未登录...");
        //如果未登录，重定向回去
        res.end(returnResult(-1, 'Err',{'msg':'未登录'}))
    }
});

/* GET users listing. */
router.get('/getUserList', function (req, res, next) {
    var sqlStr = 'select * from user_list;';
    db.query(sqlStr, '', (err, result) => {
        if (err) {
            res.end(JSON.stringify(err));
            return;
        }
        let userList = [];
        for (let i = 0; i < result.length; i++) {
            let obj = {};
            obj['user_id'] = result[i].user_id;
            obj['user_name'] = result[i].user_name;
            obj['user_alias'] = result[i].user_alias;
            obj['default_address_id'] = result[i].default_address_id;
            obj['is_blacklist'] = result[i].is_blacklist;
            obj['user_level'] = result[i].user_level;
            obj['user_create_time'] = result[i].user_create_time;
            obj['user_image'] = result[i].user_image;
            userList.push(obj)
        }
        res.end(JSON.stringify(userList));
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