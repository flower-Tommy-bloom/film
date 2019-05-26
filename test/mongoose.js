// npm i mongoose
let mongoose = require('mongoose')
// connect
mongoose.connection.on('mongoose//localhost:27017',(err)=>{
    if(err) console.log(err)
    else console.log('mongodb connected!!!')
})
// schema
let schema = new Schema({name:String,age:Number,hobby:[]})
let person = new mongoose.Model('person',schema)
// save
person.save({id:String,name:'tom',age:13,hobby:['唱','跳'],updateTime:Date})
// find data
person.find({},(err,docs)=>{
    console.log(docs)
})
person.findById({id:'1'},(err,doc)=>{
    console.log(doc)
})
person.findOne({name:'tom'},(err,doc)=>{
    console.log(doc)
})
person.find({$where:'this.age > 12'},(err,docs)=>{
    console.log(docs)
})
// update date
person.update({name:'tom'},{age:23},(err,doc)=>{ // only update one , if {mulit:true} update many
    console.log(doc)
})
person.updateMany({name:/tom/},{age:23},(err,doc)=>{ // update many
    console.log(doc)
})
person.find({name:'tom'},(err,docs)=>{
    docs.forEach((item) => {
        item.save({age:23})
    })
})
person.updateOne({name:'tom'},{hobby:['rap']}).exec() // simple logogram
// hook 
person.pre(function(next){ // don't use ()=>{} , because 'this' of 'next' not sure
    person.findOne({name:'tom'},(err,doc)=>{
        dos.save({updateTime:new Date()})
    })
    next()
})
person.post(()=>{
    person.update({name:'tom'},{updateTime:new Date()}).exec() // not need next()
})
// after find , handle
person.find().sort('age').exec((err,docs)=>{ // sort('-age') small to big
    console.log(docs) // age before big to small
})
person.find().skip(10).exec((err,docs)=> console.log(docs)) // skip 10 pair datas
person.find().limit(10).exec((err,docs)=>{console.log(docs)}) // only show 10 pair datas
person.find().select({name:1,age:1,hobby:-1}).exec((err,docs)=> console.log(docs)) // only show name and age , hidden hobby data
person.find().count((err,docs)=>console.log(count)) // show data count 
person.find().distinct().exec('age',(err,docs)=>console.log(docs)) // only age value in array
