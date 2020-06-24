var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')
const models = require('../db/models')
const {ChatModel, UserModel} = require('../db/models')
const filter = {password: 0, __v: 0}//查询时过滤指定的属性

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// router.post('/register', function(req, res) {
//   console.log('register()')
//     //1、获取请求数据
//     const {username,password} = req.body
//     //2、处理
//     if(username==='admin'){
//       res.send({code: 1, mag:'此用户已存在'})
//     } else {//注册会成功
//       //返回响应数据（成功）
//       res.send({code: 0, data: {id: 'abc123', username, password}})
//     }
// })

//注册的路由
router.post('/register', function (req, res) {
  //读取请求参数
  const {username, password, type} = req.body
  //处理:判断用户是否已经存在，如果存在，返回提升错误的信息，如果不存在，保存。
    //查询（根据username）
    UserModel.findOne({username}, function (err, user) {
      //如果user有值（已存在）
      if(user) {
        //返回提升错误的信息
        res.send({code: 1, msg: '此用户已存在'})
      }else{//没值（不存在）
        //保存
        new UserModel({username,  type, password:md5(password)}).save(function (error, user) {
          //生成一个cookie（userid： user._id），并交给浏览器保存
          res.cookie('userid', user._id, {MaxAge: 1000*60*60*24*3})
          //返回包含user的json数据
          const data = {username, type, _id:user.id}
          res.send({code: 0, data: user})
        })
      }
    })

  //返回响应数据
})

//登录的路由
router.post('/login', function (req, res) {
  const {username, password} = req.body
  //根据username，passwor查询数据库users，如果没有，返回提示错误的信息，如果有，返回登录成功信息（user）
  UserModel.findOne({username,password:md5(password)}, filter, function (err, user) {
    if(user){
      //登录成功
      //生成一个cookie（userid： user._id），并交给浏览器保存
      res.cookie('userid', user._id, {MaxAge: 1000*60*60*24*3})
      //返回登录成功信息（user）
      res.send({code: 0, data: user})
    }else{
      res.send({code: 1, msg: '用户名和密码不正确'})
    }
  })
})

//更新用户信息的路由
router.post('/updata', function (req, res) {
  //从请求的cookie得到userid
  const userid = req.cookies.userid
  //如果不存在
  if(!userid){
    return res.send({code: 1, msg: '请先登录'})
  }
  //存在，根据更新对应的user文档数据
  //得到提交的用户数据
  const user = req.body//里面没有__id
  UserModel.findByIdAndUpdate({_id: userid}, user, function (error, oldUser) {
    if(!oldUser){
      //通知浏览器删除userid cookie
      res.clearCookie('userid')
      //返回一个提示信息
      res.send({code: 1, msg: '请先登录'})
    }else{
      const {username, type, _id} = oldUser
      const data = Object.assign({username, type, _id}, user)
      res.send({code: 0, data})
    }
    
  })

})
//获取用户列表路由
router.get('/userlist', function (req,res) {
  const {type} = req.query
  UserModel.find({type}, filter, function (err, users) {
    res.send({code:0, data:users})
  })
})


//获取当前用户所有相关聊天信息列表
router.get('/msglist', function (req, res) {
  // 获取 cookie 中的 userid
const userid = req.cookies.userid
  // 查询得到所有 user 文档数组
UserModel.find(function (err, userDocs) {
  // 用对象存储所有 user 信息: key 为 user 的_id, val 为 name 和 header 组成的 user 对象
  /* const users = {}
  userDocs.forEach(doc => {users[doc._id] = {username: doc.username, header: doc.header}}) */
  const users = userDocs.reduce((users, user) => {
    users[user._id] = {username: user.username, header: user.header}
    return users
  }, {})
  /*查询 userid 相关的所有聊天信息 
  参数 1: 查询条件 
  参数 2: 过滤条件 
  参数 3: 回调函数 */ 
  ChatModel.find({'$or': [{from: userid}, {to:userid}]}, filter, function (err, chatMsgs) {
    // 返回包含所有用户和当前用户相关的所有聊天消息的数据
    res.send({code: 0, data: {users, chatMsgs}})
    })
  }) 
})

//修改指定消息为已读
router.post('/readmsg', function (req, res) {
  //得到请求中的from和to
  const from = req.body.from
  const to = req.cookies.userid
  /* 更新数据库中的聊天数据 */
  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err, doc) {
    console.log('/readmsg', doc)
    res.send({code: 0, data: doc.nModified})
  })
})

module.exports = router;
