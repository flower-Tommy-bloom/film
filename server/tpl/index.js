const htmlTpl = require('./normal')
const ejsTpl = require('./ejs')

module.exports = {
    htmlTpl:htmlTpl,
    ejsTpl:ejsTpl,
    pugTpl:require('./pug')
}