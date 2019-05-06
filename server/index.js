const Koa = require('koa')
const app = new Koa()
const {htmlTpl ,ejsTpl ,pugTpl} = require('./tpl')
const ejs = require('ejs')
const pug = require('pug')
app.use(async (ctx,next) => {
    ctx.type = 'text/html; charset=uft-8'
    ctx.body = pug.render(pugTpl,{
        you:'tom',
        me:'laaaaaaaaaaaaaaaaaa'
    })
})
app.listen(3001)