// 在这其中写入具体的路由

// 小技巧
module.exports = app => {
    const AdminUser = require('../../models/AdminUser');
    const assert = require('http-assert');
    const jwt = require('jsonwebtoken');
    // 这样的话就可以使用最外层的index.js文件
    const express = require('express');
    // 定义一个 express 的子路由，定义增删改查，各种方法
    // 获取的是动态的url参数中的值，所以需要合并参数，不然在router接口中无法获取其动态参数
    const router = express.Router({
        mergeParams: true
    })
    // 引入模型
    // const Category = require('../../models/Category')
    // 目前是做通用的接口，所以需要在每一个模型中去寻找对应的模型名称

    // 新建数据
    router.post('/', async(req, res) => {
        // 这个是提交的路由，需要将数据存入数据库中，所以此时就需要数据库了
        // 创建数据
        const model = await req.Model.create(req.body)
        // 发回客户端，让客户端知道创建完成了
        res.send(model)
    })

    // 通过id值来编辑数据
    router.put('/edit/:id', async(req, res) => {
        // 这个是提交的路由，需要将数据存入数据库中，所以此时就需要数据库了
        // 通过第一个参数找到一个新的数据，然后第二个参数就是他修改的值
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
        // 发回客户端，让客户端知道创建完成了
        res.send(model)
    })

    // 获取所有数据，此时只是用于资源列表，所以需要将这里的中间件放在路由中去
    // router.get('/', async(req, res, next) => {
    //     // 在获取数据之前，需要添加一个中间件，用于校验是否登录了
    //     // 数据可能是一个空值，所以需要做出一定的改变
    //     // const token = req.headers.authorization
    //     // 分割完之后就会变成一个数组，所以需要pop()，获取出字符串
    //     const token = String(req.headers.authorization || '').split(' ').pop();
    //     assert(token, 401, '请提供jwt token');
    //     const { id } = jwt.verify(token, app.get('secret'));
    //     assert(id, 401, '无效的jwt token');
    //     // 挂载到req或者res上去，只有这样才能使用
    //     req.user = await AdminUser.findById(id);

    //     // 以上任何一个步骤出错，都需要报错的提醒，并终止执行
    //     assert(req.user, 401, '请先登录');
    //     await next();
    // }, async(req, res) => {
    //     // 获取数据，限制十条
    //     let queryOptions = {};
    //     if (req.Model.modelName === 'Category' || req.Model.modelName === 'Item') {
    //         queryOptions.populate = 'parent';
    //     }
    //     // 通过添加populate展示出数据库中的关联字段的具体值，而不是Id值
    //     const result = await req.Model.find().setOptions(queryOptions).limit(10)
    //     // 发回客户端，让客户端获取数据
    //     res.send(result)
    // })
    router.get('/', async(req, res) => {
        // 获取数据，限制十条
        let queryOptions = {};
        if (req.Model.modelName === 'Category' || req.Model.modelName === 'Item') {
            queryOptions.populate = 'parent';
        }
        // 通过添加populate展示出数据库中的关联字段的具体值，而不是Id值
        const result = await req.Model.find().setOptions(queryOptions).limit(100)
        // 发回客户端，让客户端获取数据
        res.send(result)
    })

    // 通过id来获取详细的值
    router.get('/:id', async(req, res) => {
        // 获取数据，限制十条
        const model = await req.Model.findById(req.params.id);
        // 发回客户端，让客户端获取数据
        res.send(model)
    })

    // 通过id来删除数据之后返回全部的数据
    router.delete('/:id', async(req, res) => {
        // 删除数据
        await req.Model.findByIdAndDelete(req.params.id, req.body);
        // 发回客户端，让客户端获取数据
        res.send({
            success: true
        })
    })

    // 上面存在的中间件需要封装成一个中间件函数：登录授权中间件
    // !上传需要验证，所有的增删改查接口需要验证
    // const authMiddleware = async(req, res, next) => {
    //     // 在获取数据之前，需要添加一个中间件，用于校验是否登录了
    //     // 数据可能是一个空值，所以需要做出一定的改变
    //     // const token = req.headers.authorization
    //     // 分割完之后就会变成一个数组，所以需要pop()，获取出字符串
    //     // !正确的项目顺序是：给token设置一个过期的时间，并且token只能使用一次，一旦被使用就必须弃用
    //     let token = String(req.headers.authorization || '').split(' ').pop();
    //     // *在一定时间之后token失效
    //     setTimeout(function() { token = ""; }, 3000);
    //     assert(token, 401, '请提供jwt token');
    //     const { id } = jwt.verify(token, app.get('secret'));
    //     if (id){
    //         token = "";
    //     }
    //     assert(id, 401, '无效的jwt token');
    //     // 挂载到req或者res上去，只有这样才能使用
    //     req.user = await AdminUser.findById(id);

    //     // 以上任何一个步骤出错，都需要报错的提醒，并终止执行
    //     assert(req.user, 401, '请先登录');
    //     await next();
    // };

    const authMiddleware = require('../../middleware/auth');

    // 获取模型中间件函数
    const resourceMiddleware = require('../../middleware/resource');
    // const resourceMiddleware = async(req, res, next) => {
    //     // 因为直接获取的话是获取小写的形式，所以需要转换成类名的形式
    //     // 使用一个模块：inflection
    //     const modelName = require('inflection').classify(req.params.resource);
    //     req.Model = require(`../../models/${modelName}`);
    //     next();
    // };

    // 加上rest，表明这是一个通用接口，:resource表示的是数据库中的模型
    // 添加一个中间件函数，作为统一的前置处理，调用next()方法的时候会去处理下一个
    // 先查看是否有用户，再查看资源是什么，所以可以放在这里当中间件
    app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router)

    // 文件上传的接口，不属于上面的通用接口了，所以需要定义新的router
    // express本身无法获取数据，需要使用中间件来获取数据，使用模块multer
    const multer = require('multer');
    // 上传到上传文件夹，dest是一个路径，__dirname表示当前文件所在的文件夹绝对地址
    const upload = multer({dest: __dirname + '/../../uploads'});
    // 表示接收单个文件夹的上传，上传的时候，自动的键值的名字就是file，所以此处使用file
    app.post('/admin/api/upload', authMiddleware() , upload.single('file'),  async (req, res) => {
        const file = req.file;
        // 这样获取的file就是一大堆的描述该文件的键值对，是无法展示成图片的，所以需要返回的是url
        // 所有的必须想要访问的，都必须要定义路由，这是node的写法，可以定义一个静态路由
        file.url = `http://localhost:1999/uploads/${file.filename}`;
        res.send(file);
    })

    // 登录的接口，使用的是token的方式，登录不需要中间件来进行请求
    // 登录的接口是不需要中间件的
    app.post('/admin/api/login', async(req, res) => {
        // 通过解构进行赋值
        const {username, password} = req.body;
        // 1.根据用户名找用户，判断是否存在
        // 因为model中定义了select: false，+这个符号表示取出
        const user = await AdminUser.findOne({
            username: username
        }).select('+password');

        // 如果存在http-assert的话，就不需要这么麻烦了，只需要assert方法即可
        assert(user, 422, '账号或密码错误');
        // if (!user){
        //     // 返回一个状态码，表示不是正确的返回状态
        //     return res.status(422).send({
        //         message: '账号或密码错误'
        //     })
        // }

        // 2.校验密码
        // 通过散列的方式来进行明文和暗文的比较，第一个是明文，第二个是暗文
        // 因为在model中定义的password是select: false，所以需要特殊的取值
        const isValid = require('bcrypt').compareSync(password, user.password);
        assert(isValid, 422, '账号或密码错误');
        // 使用以上的办法并不会提示那个错误信息，所以需要进行错误处理，在所有路由的最后加上

        // if (!isValid){
        //     // 表示密码不一致
        //     return res.status(422).send({
        //         message: '账号或密码错误'
        //     })
        // }

        // 3.返回token
        // 通过其签名方法来生成一个token，第一个参数需要有用户的唯一标识id，也可以携带其余的参数
        // 不过一般都不需要使用username，因为这个是使用id来主动获取的
        // 第二个参数很重要，是一个密钥，到时候就可以通过jwt.verfiy来进行校验
        // 随便给一个字符串就行，不过一般都是全局的东西，所以不放在这里
        // 这里是通过参数名来定义路由还是在获取配置
        const token = jwt.sign({
            id: user._id,
            _id: user._id,
        }, app.get('secret'));
        
        // 4.按需返回数据
        res.send({token});
    })


    // 路由错误的处理，所有路由错误了都会如此处理
    app.use(async (err, req, res, next) => {
        res.status(err.status || 500).send({
            type: 'error',
            message: err.message
        })
    })
}