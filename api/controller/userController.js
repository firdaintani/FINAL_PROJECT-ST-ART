var db = require('./../database')
// const nodemailer = require('nodemailer')
const cryp = require('crypto')


module.exports = {
   
    getAllUser : (req,res)=>{
        var sql = 'select * from user'
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true,msg : 'error in database'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    },
    getUser : (req,res)=>{
        var username = req.query.username
        var sql = `select * from user where username='${username}'`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg : 'error in database'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    },
   

    
    testencrypt :(req,res)=>{
        var password = req.query.password
        var hasil = cryp.createHmac('sha256', 'inikey').update(password).digest('hex')
        console.log(password + ' telah di ekrip menjadi '+hasil)
        console.log('panjang hasil enkrip adalah = '+hasil.length)
    }

}