var mysql = require('mysql');
var experss = require('express');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');

var connection = mysql.createConnection({
    host: '35.206.225.223',//global.SERVER_IP,
    user: 'root',
    password: '',
    port: '3306',
    database: 'ColledgeGuard'
});

var app = experss();
connection.connect();
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

const table_user_info = "userinfo";

// 查询用户
app.get('/request/user/selectuser', function getUser(req, res) {
    var getObj = req.query;
    var selectSQL = 'SELECT * FROM ' + table_user_info +' WHERE username = ?';
    var selectParams = [getObj.name];
    console.log(selectParams);
    connection.query(selectSQL, selectParams, function (err, result) {
        if (err) {
            res.json({
                result: 'N',
                message: err.message
            });
        } else {
            console.log(result);
            res.json({
                result: 'Y',
                message: result
            });
        }
    })
});

// 更新密码
app.post('/request/user/updatepwd', function UpdateUserPwd(req, res) {
    let getObj = req.query;
    console.log(getObj);
    let updateSQL = 'UPDATE '+ table_user_info +' SET pwd = ? ' + 'WHERE username = ? ';
    let updateParams = [
        getObj.pwd,
        getObj.name
    ];
    console.log(updateParams);
    //database
    connection.query(updateSQL, updateParams, function (err, result) {
        if (err) {
            console.log('Update pwd Error\n');
            res.json({
                result: 'N',
                message: err.message
            });
        } else {
            res.json({
                result: 'Y',
                message: 'Success'
            });
        }
    })
});


// 创建账号
app.post('/request/user/insert', function insertUser(req, res) {
    var getObj = req.body;
    var insertSQL = 'INSERT INTO '+table_user_info+'(username, pwd, email) ' +
        'VALUES(?, ?, ?)';
    var insertParams = [
        getObj.name,
        getObj.pwd,
        getObj.email,
    ];
    console.log(insertParams);
    connection.query(insertSQL, insertParams, function (err, result) {
        if (err) {
            console.log('Insert user Error\n');
            res.json({
                result: 'N',
                message: err.message
            });
        } else {
            res.json({
                result: 'Y',
                message: 'Success'
            });
        }
    })
});


var server = app.listen(8003, function () {
    console.log("Server open on ", server.address());
})
