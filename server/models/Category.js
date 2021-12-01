const mongoose = require('mongoose')

// 定义模型的字段有什么
const schema = new mongoose.Schema({
    name: { type: String },
    parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }
})

// 子分类
schema.virtual('children', {
    localField: '_id',
    foreignField: 'parent',
    justOne: false,
    ref: 'Category'
})

// 子分类来关联新闻
schema.virtual('newsList', {
    localField: '_id',
    foreignField: 'categories',
    justOne: false,
    ref: 'Article'
})

// 子分类来关联英雄
schema.virtual('heroList', {
    localField: '_id',
    foreignField: 'categories',
    justOne: false,
    ref: 'Hero'
})

// 导出模型，导出模型的时候一般存在第三个参数：集合名字，一般都是通过类名来自动生成（小写复数形式）
module.exports = mongoose.model('Category', schema)