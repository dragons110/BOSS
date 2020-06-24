
const md5 = require('blueimp-md5')//md5加密函数
//引入mongoose
const mongoose = require('mongoose')
//连接到指定数据库（url只有数据库是变化的）
mongoose.connect('mongodb://localhost:27017/gzhipin_test')
//获取连接对象
const conn = mongoose.connection
//绑定连接完成的监听
conn.on('connected', function () {
    console.log('WHOO!!数据库连接成功')
})

/* 2.得到对应特定集合的Model */
//2.1 定义schema（描述文档结构）

const userSchema = mongoose.Schema({
//指定文档的结构:属性名/属性值的类型，是否是必须的，默认值
    username: {type:String, required: true},
    password: {type:String, required: true},
    type: {type:String, required: true},
})
//2.2 定义Model（与集合对应，可以操作集合）
const UserModel = mongoose.model('user', userSchema)//确定集合名为users

/* 3.通过Model或其他实例对集合数据进行CRUD操作 */
//3.1 通过Moedl实例的save（）添加数据
function testSave() {
    //创建UserModel实例
    const userModel = new UserModel({username:'Bob', password:md5('123'), type:'laoban'})
    //调用save（）保存
    userModel.save(function (error, user) {
        console.log('save()', error, user)
    })
}
// testSave()

//3.2 通过Model的find（）/findOne（）查询多个或一个数据
function testFind() {
    UserModel.find({_id:'5ed8b880dbea12153425dda2'}, function (error, users) {
        console.log('find()',error,users)
    })
    //查询一个
    UserModel.findOne({_id:'5ed8b880dbea12153425dda2'}, function (error, user) {
        console.log('findOne()', error, user)
    })
}
// testFind()

//3.3 通过Model的findByIdAndUpdate（）更新某个数据
function testUpdata() {
    UserModel.findByIdAndUpdate({_id:'5ed8b880dbea12153425dda2'}, {username:'Jack'}, function (error, doc) {
        console.log('findByIdAndUpdate()',error,doc)
    }) 
}
// testUpdata()
//3.4 通过Model的remove（）删除匹配的数据。
function testDelete() {
    UserModel.remove({_id:'5ed8b880dbea12153425dda2'}, function (error, doc) {
        console.log('remove()', error, doc)
    })
}
// testDelete()
