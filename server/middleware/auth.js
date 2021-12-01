// 写成函数套函数的形式，增加结构的可拓展性
// 接收一个参数来获取return的函数，这样options可以被配置，此处没有使用
module.exports = options => {
    const AdminUser = require('../models/AdminUser');
    const jwt = require('jsonwebtoken');
    const assert = require('http-assert');

    return async(req, res, next) => {
        // 在获取数据之前，需要添加一个中间件，用于校验是否登录了
        // 数据可能是一个空值，所以需要做出一定的改变
        // const token = req.headers.authorization
        // 分割完之后就会变成一个数组，所以需要pop()，获取出字符串
        // !正确的项目顺序是：给token设置一个过期的时间，并且token只能使用一次，一旦被使用就必须弃用
        const token = String(req.headers.authorization || '').split(' ').pop();
        // ?在一定时间之后token失效
        // ?setTimeout(function() { token = ""; }, 3000);
        // 请提供jwt token
        assert(token, 401, '请先登录');
        const { id } = jwt.verify(token, req.app.get('secret'));
        // ?token使用一次之后应当是无法继续使用的
        // ?if (id) token = "";
        // 无效的token
        assert(id, 401, '请先登录');
        // !此处的AdminUser仅仅只是后端测试的时候使用，在前端调用的时候肯定不是这样
        // !所以需要将AdminUser设置成可配置的
        // 挂载到req或者res上去，只有这样才能使用
        req.user = await AdminUser.findById(id);

        // 以上任何一个步骤出错，都需要报错的提醒，并终止执行
        assert(req.user, 401, '请先登录');
        await next();
    };
}