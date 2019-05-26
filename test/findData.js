let mongoose = require('mongoose')
let Model = mongoose.model('Movie')
Model.find({$where:'this.site == undefined'}).exec((err,doc)=>{
    console.log(doc)
    console.log(doc.length + '条')
})