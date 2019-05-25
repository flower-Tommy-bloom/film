const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const {Mixed} = Schema.Types
const SALT_WORK_FACTOR = 10 // 盐值
const MAX_LOGIN_ATTEMPTS = 5  // 登录次数
const LOCK_TIME = 2 * 60 *60 *60 // 锁定时间
const UserSchema = new Schema({
    username: {
        unique: true,
        required: true,
        type: String
    },
    email: {
        unique: true,
        required: true,
        type: String
    },
    password: {
        unique: true,
        type: String
    },
    loginAttempts:{ // 登录次数
        type: Number,
        required: true, // 必须有这个值
        default: 0
    }, 
    lockUntil:Number,
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})
// 虚拟字段 不存入数据库
UserSchema.virtual('isLocked').get(function(){
    return !!this.lockUntil && this.lockUntil > Data.now() // 没登录的时间是否超过了 锁定时间
})
// 保存之前
UserSchema.pre('save', function(next){
    if (!user.isModified('password')) return next() // isModified 查看某一字段是否被更改
    // SALT_WORK_FACTOR 盐 一个常量
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err)
        // hash对密码进行加密 salt盐
        bcrypt.hash(user.password, salt, (error, hash) => {
            if(error) return next(error)
            this.password = hash // 密码加盐之后的值 
            next()
        })
    })
    // if (this.isNew) {
    //     this.meta.createdAt = this.meta.updateAt = Data.now()
    // } else {
    //     this.meta.updateAt = Data.now()
    // }
    next()
})
// 生成一些中间件的方法
UserSchema.methods = {
    // 密码比较
    comparePassword:(_password,password) => {
        return new Promise((resolve,reject) => {
            bcrypt.compare(_password, password, (err, isMatch) => {
                if (err) reject(err)
                else resolve(isMatch)
            }) 
        })
    },
    // 登录错误次数限制
    incLoginAttepts: (user) => {
        return new Promise((resolve,reject) => {
            // 如果没有超过限制次数
            if(this.lockUntil && this.lockUntil < Date.now()) {
                this.update({
                    $set: { // $set 用来指定一个键并更新键值，若键不存在并创建。
                        incLoginAttepts: 1
                    },
                    $unset: { // 从字面就可以看出其意义，主要是用来删除键。
                        lockUntil:1
                    }
                },(err) => {
                    if(!err) resolve(true)
                    else reject(err)
                })
            }else{
                let updates = {
                    $inc: { // $inc 对值进行增减的操作
                        loginAttempts: 1
                    }
                }
                // 如果超过的登录限制次数 , 并且没有被锁定 , 那么就把lockUntil设置为 LOCK_TIME 之后
                if(this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
                    updates.$set = {
                        lockUntil: Date.now() + LOCK_TIME
                    }
                }
    
                this.undate(updates, err => {
                    if(!err) resolve(true)
                    else reject(err)
                })
            }
        })
    }
}

mongoose.model('User', UserSchema)