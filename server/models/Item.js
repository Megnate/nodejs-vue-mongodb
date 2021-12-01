const mongoose = require('mongoose')

// 定义模型的字段有什么
const schema = new mongoose.Schema({
    name: { type: String },
    icon: { type: String },
    parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }
})

// 导出模型
module.exports = mongoose.model('Item', schema)