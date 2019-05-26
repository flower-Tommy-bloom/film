const mongoose = require('mongoose')
const Schema = mongoose.Schema // 定义数据的类型,字段
const {ObjectId, Mixed} = Schema.Types  // Mixed任何数据类型
const movieSchema = new Schema({
    doubanId:{
        unique: true, // 唯一的
        type:String
    },
    category: {
        type: ObjectId,
        ref: 'Category'
    },
    rete:Number,
    title:String,
    poster:String, // 海报
    
    cover:String, // 封面
    actors:[String],
    movieTypes:[String], // 数组 里面是字符串
    site:String, // 地区
    summary:String, // 简介
    video:String, // 预告片

    // visioKey:String, // 转存到自己的服务器时用的key
    // posterKey:String,
    // coverKey:String,
    pubdate:Mixed,
    year:Number,
    review:Mixed, // 评论
    meta: {
        createdAt: {
            type: Date,
            default:Date.now()
        },
        updateAt: {
            type: Date,
            default:Date.now()
        }
    }
})
// 保存之前
movieSchema.pre('save', function(next){
    if(this.isNew) { // 是不是新的
        this.meta.createdAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})

mongoose.model('Movie', movieSchema)
