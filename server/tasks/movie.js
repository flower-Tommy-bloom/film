// 子进程
const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model("Movie")
;(async () => {
    // let result
    // const script = resolve(__dirname + './../crawler/film-detail')
    // const child = cp.fork(script, [])
    // let inboked = false
    // child.on('error', err => {
    //     if(inboked)return
    //     inboked = true
    //     console.log(err)
    // })
    // child.on('exit', code => {
    //     if(inboked)return
    //     inboked = false
    //     let err = code === 0 ? console.log('子进程顺利退出' + code) : new Error('exit code' + code)
    // })
    
    // child.on('message', (data) => {
    //     result = data.result
    //     console.log('message')
    //     // getDetail(result)
    //     result.forEach(async item => {
    //         let movie = await Movie.findOne({
    //             doubanId:item.doubanId
    //         })
    //         if(!movie){
    //             movie = new Movie(item)
    //             await movie.save()
    //         }
    //     })
    // }) 130
    let counts = -1
    let failNum = 0
    addFilmDetail('一号小弟')
    // addFilmDetail('二号小弟')
    // addFilmDetail('三号小弟')
    // addFilmDetail('四号小弟')
    // addFilmDetail('五号小弟')
    function addFilmDetail(whoDoIt){
        counts++
        Movie.findOne({$where:'this.site == undefined'}).skip(counts).exec((err,doc)=>{
            if(err){
                console.log(err)
                addFilmDetail(whoDoIt)
            }else{
                if(doc && doc.doubanId){
                    getDetail(doc.doubanId,whoDoIt).then(res =>{
                        console.log(`第${counts}号电影:${doc.title}`+'---->数据更新成功' +`   ${whoDoIt} 失败条数${failNum}` )
                        addFilmDetail(whoDoIt)
                    })
                }
            }
        })
    }
    function getDetail(result,whoDoIt) {
        return new Promise((resolve1,reject)=>{
            const scriptDetail = resolve(__dirname + './../crawler/film-detail')
            console.log('scriptDetail',scriptDetail)
            const childDetail = cp.fork(scriptDetail, [])
            childDetail.send({doubanId:result})
            childDetail.on('error',(err)=>{
                failNum++
                console.log(`${whoDoIt}萎了,现在立即重启`)
                addFilmDetail(whoDoIt)
            })
            childDetail.on('exit',() => {
                // console.log('exit proeess')
            })
            childDetail.on('message',async (data,fail) => {
                if(!fail){
                    resolve1(data)
                    Movie.update({doubanId:result},data).exec()
                }else{
                    failNum++
                    console.log(`${whoDoIt}萎了,现在立即重启`)
                    addFilmDetail(whoDoIt)
                }
            })
        })
    }
})()