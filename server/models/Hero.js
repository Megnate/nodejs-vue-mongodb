const mongoose = require('mongoose')

// 定义模型的字段有什么
const schema = new mongoose.Schema({
    name: { type: String },
    title: { type: String },
    icon: { type: String },
    banner: { type: String },
    // 这样就可以关联多个，以数组的形式来关联多个分类，实现多选
    categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
    scores: {
        difficult: { type: Number },
        skills: { type: Number },
        attack: { type: Number },
        service: { type: Number },
    },
    skills: [{
        icon: { type: String },
        name: { type: String },
        description: { type: String },
        tips: { type: String },
        coolDown: { type: String },
        cost: { type: String },
    }],
    // 顺风出装
    items1: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Item'}],
    // 逆风出装
    items2: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Item'}],
    usage_tips: { type: String },
    battle_tips: { type: String },
    team_tips: { type: String },
    partners: [{
        hero: { type: mongoose.SchemaTypes.ObjectId, ref: 'Hero'},
        description: { type: String }
    }],
    counters: [{
        hero: { type: mongoose.SchemaTypes.ObjectId, ref: 'Hero'},
        description: { type: String },
    }],
    gankers: [{
        hero: { type: mongoose.SchemaTypes.ObjectId, ref: 'Hero'},
        description: { type: String },
    }],

})

// 导出模型，表名一般都是小写和复数形式，但是不会加es，所以此时需要手动赋值
module.exports = mongoose.model('Hero', schema, "heroes")