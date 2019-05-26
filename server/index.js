const Koa = require('koa')
const app = new Koa()
const mongoose = require('mongoose')
const views = require('koa-views')
const { resolve } = require('path')
const { connect, initSchemas, initAdmin } = require('./database/init')

const R = require('ramda')
const MIDDLEWARES = ['router']

const useMiddlewares = app => {
    R.map(R.compose(
        R.forEachObjIndexed(
            initWith(app)
        ),
        require,
        name => resolve(__dirname, `./middlewares/${name}`)
    ))(MIDDLEWARES)
}
;(async () => {
    await connect()
    initSchemas()
    await initAdmin()

    const app = new Koa()
    await useMiddlewares(app)
    app.listen(3001)
})()

