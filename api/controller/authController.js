var db = require('../database')
var cryp = require('crypto')
const sendEmail= require('../helpers/sendEmail')
const transporter = require('../helpers/nodemailer')

module.exports={
    userLogin : (req,res)=>{
        var username = req.query.username
        var password = req.query.password
        var passwordBr = cryp.createHmac('sha256', 'key').update(password).digest('hex')
    
        var sql = `select * from user where username='${username}' and password='${passwordBr}'`
        db.query(sql, (err, result)=>{
            try{
                if(err) throw {error:true, msg: 'Username or password wrong. Please check again.'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    },  
    registerUser : (req,res)=>{
        var data = req.body
       
        var pass = req.body.password
        var passwordBr = cryp.createHmac('sha256', 'key').update(pass).digest('hex')
  
        var code_verify = Math.floor(Math.random()*Math.pow(10,6))
        var mailOptions =sendEmail(data.username,data.email, code_verify)
        var data = {...req.body, password:passwordBr, code_verify}
        // var sql = `select * from user where username="${req.body.username}"`   
        // db.query(sql, (err,result)=>{
        //     try{
                // if(err) throw err
                // if(result.length>0){

                var sql1 = `insert into user set ?`
                db.query(sql1, data,(err1,result1)=>{
                    try{
                        if(err1) throw {error:true, msg :'Username not available. Please try another username.'}
                        // var sql2 = `select * from user where username="${req.body.username}"`
                        // db.query(sql2, (err2,result2)=>{
                        //     try{
                        //         if (err2) throw err
                                    transporter.sendMail(mailOptions,(err,result)=>{
                                        if(err) throw {error:true, msg:'error while sending the email'}
                                        res.send(result)
                                    })
                                
                                // res.send(result2[0])
                            }
                            // catch{
                            //     res.send(err2.message)
                            // }
                        // })
                    // }
                    catch(err){
                        console.log(err)
                        res.send(err)
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
        verify : (req,res)=>{
            // var username = req.query.username
            var username = req.body.username
            var sql = `update user set verified=1 where username='${username}'`
            db.query(sql, (err, result)=>{
                try{
                    if (err) throw {error:true,msg:'Username not found'}
                    res.send("You've verified your account. Now you can login to your account")
                }
                catch(err){
                    res.send(err)
                }
            })
        },
        
    resendEmail : (req,res)=>{
        var email= req.body.email
        var username = req.body.username
        var code_verify = Math.floor(Math.random()*Math.pow(10,6))
        var subject = `Please verify your account`
        var content = `
        <div>
        <h1>Please verify your account with the code.</h1>
        <p>your code is : <strong>${code_verify}</strong> </p>
        <h3>Click this <a href='http://localhost:3000/verify?username=${username}'>link</a> to verify your account </h3>
        
        </div>
        `
        var mailOptions =sendEmail(subject, email, content)
        var sql = `update user set code_verify=${code_verify} where username='${username}'`
        db.query(sql,(err,result)=>{
            try{
                if(err) throw {error:true, msg:'failed create new code'}
                
                //  console.log('masuk')
                
                transporter.sendMail(mailOptions,(err1,result1)=>{
                    // try{
                        if(err1) throw {error:true, msg:'failed while sending email'}
                        res.send('success')
         
                })
    
            }
            catch(err){
                res.send(err)
            }
        })
        
    },
}