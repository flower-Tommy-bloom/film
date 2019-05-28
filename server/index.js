const Koa = require('koa')
const app = new Koa()
const mongoose = require('mongoose')
const { resolve } = require('path')
const { connect, initSchemas } = require('./database/init')
const bodyParser = require('koa-bodyparser')
const router = require('./routes')

;(async () => {
    await connect()
    await initSchemas()
    app
        .use(bodyParser())
        .use(router.routes())
        .use(router.allowedMethods())
    app.listen(3001)
})()

