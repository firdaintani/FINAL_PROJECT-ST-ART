var db = require('./../database')
const nodemailer = require('nodemailer')
const cryp = require('crypto')
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

module.exports = {
    userLogin : (req,res)=>{
        var username = req.query.username
        var password = req.query.password
        var passwordBr = cryp.createHmac('sha256', 'key').update(password).digest('hex')
    
        var sql = `select * from user where username='${username}' and password='${passwordBr}'`
        db.query(sql, (err, result)=>{
            try{
                if(err) throw err
                res.send(result)
            }
            catch{
                res.send(err.message)
            }
        })
    }, 
    getAllUser : (req,res)=>{
        var sql = 'select * from user'
        db.query(sql, (err,result)=>{
            try{
                if(err) throw err
                res.send(result)
            }
            catch{
                res.send(err.message)
            }
        })
    },
    getUser : (req,res)=>{
        var username = req.query.username
        var sql = `select * from user where username='${username}'`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw err
                res.send(result)
            }
            catch(err){
                res.send(err.message)
            }
        })
    },
    registeUser : (req,res)=>{
        var to= req.body.email
        
        var mailOptions ={
            from : 'ST-ART <purwadhika@purwadhika.com>',
            to : to,
            subject : 'Confirm Account',
            html :  `<h1>Klik <a href='http://localhost:4000/user/verify?username=${req.body.username}'>link</a> ini untuk mengaktifkan akun </h1>`
        }
        var pass = req.body.password
        var passwordBr = cryp.createHmac('sha256', 'key').update(pass).digest('hex')
    
        
        var data = {...req.body, password:passwordBr}
        // var sql = `select * from user where username="${req.body.username}"`   
        // db.query(sql, (err,result)=>{
        //     try{
                // if(err) throw err
                // if(result.length>0){

                var sql1 = `insert into user set ?`
                db.query(sql1, data,(err1,result1)=>{
                    try{
                        if(err1) throw err
                        var sql2 = `select * from user where username="${req.body.username}"`
                        db.query(sql2, (err2,result2)=>{
                            try{
                                if (err2) throw err
                                if(to){
                                    transporter.sendMail(mailOptions,(err,result)=>{
                                        if(err) throw err
                                        res.send(result)
                                    })
                                }else{
                                    res1.send('alamat email belum ada')
                                }
                                // res.send(result2[0])
                            }
                            catch{
                                res.send(err2.message)
                            }
                        })
                    }
                    catch{
                        res.send(err1.message)
                    }
                } )
            },
            // else {
            //     res.send('duplikat')
            // }
            // }
        //     catch{
        //         res.send('dup')
        //     }
        // }) 
        // }

    sendEmail : (req,res)=>{
        var to= req.query.email
        
        var mailOptions ={
            from : 'ST-ART <purwadhika@purwadhika.com>',
            to : to,
            subject : 'Test Nodemailer',
            html :  `<h1>Klik <a href='http://google.com'>link</a> ini untuk mengaktifkan akun </h1>`
        }
    
        if(to){
            transporter.sendMail(mailOptions,(err,result)=>{
                if(err) throw err
                res.send('email berhasil dikirim')
            })
        }else{
            res1.send('alamat email belum ada')
        }
    },
    verify : (req,res)=>{
        var username = req.query.username
        var sql = `update user set verified=1 where username='${username}'`
        db.query(sql, (err, result)=>{
            try{
                if (err) throw err
                res.send('<h3>Sudah terverified</h3>')
            }
            catch{

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