const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'firdaintani5797@gmail.com',
        pass : 'iaiclciljniuirxl'
    },
    tls : {
        rejectUnauthorized : false
    }
})

module.exports= transporter