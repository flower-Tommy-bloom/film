const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {Mixed, ObjectId} = Schema.Types
const categorySchema = new Schema({
    name: {
        unique: true,
        type: String
    },
    movies: [{
        type: ObjectId,
        ref: 'Movie' // 指向关系
    }],
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

categorySchema.pre('save', function(next){
    if(this.isNew) {
        this.meta.createdAt = this.meta.updateAt = Data.now()
    } else {
        this.meta.updateAt = Data.now()
    }
    next()
})

mongoose.model('Category', categorySchema)
