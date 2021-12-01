const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    categories: [
        { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }
    ],
    title: { type: String },
    // 存入随意的类型
    body: { type: mongoose.Schema.Types.Mixed },
}, {
    timestamps: true
})
// timestamps:表明带有时间戳

module.exports = mongoose.model('Article', schema);