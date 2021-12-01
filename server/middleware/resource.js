module.exports = options => {
    return async(req, res, next) => {
        // 因为直接获取的话是获取小写的形式，所以需要转换成类名的形式
        // 使用一个模块：inflection
        const modelName = require('inflection').classify(req.params.resource);
        req.Model = require(`../models/${modelName}`);
        next();
    };
}