// 子进程
const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model("Movie")
;(async () => {
    const script = resolve(__dirname + './../crawler/trailer-list')
    const child = cp.fork(script, [])
    let inboked = false
    child.on('error', err => {
        if(inboked)return
        inboked = true
        console.log(err)
    })
    child.on('exit', code => {
        if(inboked)return
        inboked = false
        let err = code === 0 ? null : new Error('exit code' + code)
    })
    child.on('message', data => {
        let result = data.result
        result.forEach(async item => {
            let movie = await Movie.findOne({
                doubanId:item.doubanId
            })
            if(!movie){
                movie = new Movie(item)
                await movie.save()
            }
        })
    })
})()