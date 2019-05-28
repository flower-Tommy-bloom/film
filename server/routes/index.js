const Router = require('koa-router')
const mongoose = require('mongoose')
const router = new Router()


router.get('/api/movies', async (ctx, next) => {
    console.log(ctx)
    const movie = mongoose.model('Movie')
    const movies = await movie.find({}).limit(1)
    ctx.body = {
        movies
    }
    next()
})
router.post('/api/login', async (ctx, next) => {
    // console.log(ctx)
    console.log(ctx.request.body);
    // const movie = mongoose.model('Movie')
    // const movies = await movie.find({}).limit(1)
    ctx.body = {
        val:ctx.request.body,
        success:true
    }
    next()
})
module.exports = router