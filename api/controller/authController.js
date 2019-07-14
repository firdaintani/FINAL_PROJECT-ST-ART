var db = require('../database')
var cryp = require('crypto')
const sendEmail= require('../helpers/sendEmail')
const transporter = require('../helpers/nodemailer')

module.exports={
    userLogin : (req,res)=>{
        var username = req.query.username
        var password = req.query.password
        var passwordBr = cryp.createHmac('sha256', 'key').update(password).digest('hex')
    
        var sql = `select username, role, verified,email from user where username='${username}' and password='${passwordBr}'`
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
        var subject = `Please verify your account`
        var content = `
        <div>
        <h1>Please verify your account with the code.</h1>
        <p>your code is : <strong>${code_verify}</strong> </p>
        <h3>Click this <a href='http://localhost:3000/verify?username=${data.username}'>link</a> to verify your account </h3>       
        </div>
        ` 
        var mailOptions =sendEmail(subject, req.body.email, content)
        var data = {...req.body, password:passwordBr, code_verify}
        
                var sql1 = `insert into user set ?`
                db.query(sql1, data,(err1,result1)=>{
                    try{
                        if(err1) throw {error : true, msg : err1.sqlMessage}
                        // if(err1) throw err1.
                            transporter.sendMail(mailOptions,(err,result)=>{
                                if(err) throw {error:true, msg:'error while sending the email'}
                                res.send('Register success')
                            })
                                
                        }
                        
                    catch(err){
                     
                        res.send(err)
                    }
                } )
        },
        verify : (req,res)=>{            
            var username = req.body.username
            var code = req.body.code
            var sql= `select code_verify from user where username='${username}' and code_verify=${code}`

        
            db.query(sql, (err, result)=>{
                try{
                    if (err) throw {error:true,msg:'error in db'}
                    if(result.length>0){
                      
                        var sql2 = `update user set verified=1 where username='${username}'`
                        db.query(sql2, (err2,result2)=>{
                            if (err) throw {error:true,msg:'Cant set'}
                            res.send("You've verified your account. Now you can login to your account")
    
                        })
    
                    }else{
                        res.send({error:true,msg:'Wrong code! Check your email to see the code.'})
                    }
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
        var subject = `ST-ART Verify Your Account`
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
                transporter.sendMail(mailOptions,(err1,result1)=>{
                        if(err1) throw {error:true, msg:'failed while sending email'}
                        res.send('success')
         
                })
    
            }
            catch(err){
                res.send(err)
            }
        })
    }
}