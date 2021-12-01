module.exports = app => {
    const mongoose = require('mongoose')

    // 连接 mongoose 数据库，连接的端口如上，数据库名称为node-vue-moba，连接参数为后面那个 
    mongoose.connect('mongodb://localhost:27017/node-vue-moba', {
        useNewUrlParser: true
    })
    .then(() => console.log("数据库连接成功"))
    .catch(() => console.log("数据库连接失败"));

    // 将models这个文件夹下的所有文件都引用了
    require("require-all")(__dirname + '/../models')
}