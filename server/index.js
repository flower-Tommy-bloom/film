const Koa = require('koa')
const app = new Koa()
const mongoose = require('mongoose')
const views = require('koa-views')
const { resolve } = require('path')
const { connect, initSchemas } = require('./database/init')

// ;(async () => {
//     await connect()
//     initSchemas()
//     // require('./tasks/movie')
//     require('../test/findData')
// })()

app.use(views(resolve(__dirname,'./views'), {
    extension:'pug'
}))
app.use(async (ctx,next) => {
    await ctx.render('index', {
        you:'tom',
        me:'hhhhhhhhh'
    })
})
app.listen(3001)