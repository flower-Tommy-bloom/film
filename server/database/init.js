const mongoose = require('mongoose')
const db = 'mongodb://localhost/film'
const glob = require('glob') // 匹配规则
const { resolve } = require('path')

mongoose.Promise = global.Promise

exports.initSchemas = () => {
    glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}
exports.connect = () => {
    let connectCount = 0 
    // 判断是否为生产环境
    return new Promise((resolve,reject) => {
        if(process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true)
        }
        // 链接数据库 ,{ useMongoClient:true // 4.0几的版本的MongoDB需要设置这个 }
        mongoose.connect(db)
        // 重连
        mongoose.connection.on('disconnected', () => {
            if(connectCount < 5){
                connectCount++
                mongoose.connect(db)
            }else{
                throw new Error('数据库挂了')
            }
        })
        // 有错误的时候
        mongoose.connection.on('error', err => {
            reject(err)
        })
        // 数据库链接成功
        mongoose.connection.once('open', () => {
            resolve('ok')
            console.log('MongooDB Connected successfully!')
        })
    })
}