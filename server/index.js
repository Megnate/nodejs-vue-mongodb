const express = require("express")

// 创建一个express的实例
const app = express();

// 在当前的app的实例上面设置一个变量，但其实这个字符串也不应该放在这，而是应该放在环境变量中
// 环境变量就是创建一个.key的文件，然后在这里引用
app.set('secret', 'iscscasjk232');

// 引入跨域模块
app.use(require('cors')())

// 加上中间件，使用Category模型的create方法来添加数据 
app.use(express.json())

// 托管静态文件，让后面路径中的文件都可以通过/uploads这个路径来访问
app.use('/uploads', express.static(__dirname + '/uploads'))

require('./plugins/db')(app)
// 将函数引用过来并将app传给admin中的index.js
require('./routes/admin')(app)

// 生成一个测试的数据，将数组变成json对象
require('./routes/web')(app)

// 在1999端口启动
app.listen(1999, () => {
    console.log('http://localhost:1999');
})