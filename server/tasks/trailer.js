// 子进程
const cp = require('child_process')
const { resolve } = require('path')
;(async () => {
    const script = resolve(__dirname + './../crawler/video')
    const child = cp.fork(script, [])
    let inboked = false
    child.on('error', err => {
        if(inboked)return
        inboked = true
        console.log(err)
    })
    child.on('exit', code => {
        if(inboked)return
        inboked = true
        let err = code === 0 ? null : new Error('exit code' + code)
    })
    child.on('message', data => {
        console.log(data)
    })
})()