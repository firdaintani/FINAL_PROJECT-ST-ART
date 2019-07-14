var db = require('./../database')
const sendEmail= require('../helpers/sendEmail')
const transporter = require('../helpers/nodemailer')
var cryp = require('crypto')
var fs = require('fs')

module.exports = {
   
   
    getUser : (req,res)=>{
        var username = req.query.username
        var sql = `select username, role, verified,email from user where username='${username}'`
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
    getProfilPicture : (req,res)=>{
        var username = req.query.username
        var sql = `select profil_image from user where username='${username}'`
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
    getDataProfile : (req,res)=>{
        var username = req.query.user
        var sql = `select username, name, email,phone from user where username='${username}'`
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
    updateProfileImage : (req,res)=>{
        var username = req.query.user
        var data = { profil_image : req.file.path}
            var sql = `update user set ? where username='${username}'`
            db.query(sql, data, (err,result)=>{
                try{
                    if(err) throw {error:true, msg:'error in database while updating data'}
                    if(req.body.oldImage){
                    
                        fs.unlinkSync(req.body.oldImage)

                    }
                    
                    var sql1 = `select username, name, email,phone from user where username='${username}'`
                    db.query(sql1, (err1,result1)=>{
                        
                            if(err1) throw {error:true, msg : 'error in database'}
                            res.send(result1)
                        
                    })

                }
                catch(err){
                    res.send(err)
                }
            })
    },
    getPassword : (req,res)=>{
        var username = req.query.username
        var password = req.query.password
        var passwordBr = cryp.createHmac('sha256', 'key').update(password).digest('hex')
    
        var sql = `select username from user where username='${username}' and password='${passwordBr}'`
        db.query(sql, (err, result)=>{
            try{
                if(err) throw {error:true, msg: 'error in db'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    },
    updateProfileUser : (req,res)=>{
       
            var username = req.query.username
            var data = req.body
           
            var newData = {...data}
            delete newData.oldEmail
            // console.log(newData.username)
            var sql = `update user set ? where username='${username}'`
            db.query(sql, newData, (err,result)=>{
               try{
                                      
                   if(err) throw err
                  

                   if(data.oldEmail!==null){
                    
                    var subject = `Your Email Has Been Changed`
                    var content = `
                    <div>
                    <h1>Your Email Has Been Changed</h1>
                    <p>Hello, ${username},<br></br> <br></br>
                    Your ST-ART Email has been successfully converted into ${data.email}. All the notifications email from ST_ART will be sent to this new email. If you do not submit this email contact, call our costumer service 1501203. <br></br> <br></br> Warm regards, ST-ART Team</p>
                      
                    </div>
                    ` 
                    var mailOptions =sendEmail(subject, data.oldEmail, content)
                    transporter.sendMail(mailOptions,(err1,result1)=>{
                        if(err1) throw {error:true, msg:'error while sending the email'}
                        var subject1='New Email for ST-ART Account'
                        var content1 = `
                        <div>
                        
                        <p>Hello, ${username},<br></br> <br></br>
                        You have registered ${data.email} as your email address in ST-ART. </p>
                        
                        </div>
                        ` 
                        var mailOptions1 =sendEmail(subject1, data.email, content1)
                        transporter.sendMail(mailOptions1,(err2,result2)=>{
                            if(err2) throw {error:true, msg:'error while sending the email to new email'}
                            
                        })
                    })

                    
                }
                var sql1 = `select username, name, email,phone from user where username='${newData.username}'`
                db.query(sql1, (err3,result3)=>{
                    
                        if(err3) throw {error:true, msg : 'error in database'}
                        // console.log(result3)
                        res.send(result3)
           
                })
                   
                    
                }
                catch(err){
                    res.send(err)
                }
            })
        },
        changePassword:(req,res)=>{
            var data = req.body

            var passwordBr = cryp.createHmac('sha256', 'key').update(data.password).digest('hex')
    
            var sql = `update user set password='${passwordBr}' where email='${data.email}'`
            db.query(sql, (err,result)=>{
                try{
                    if(err) throw {error:true, msg : 'error in database'}
                    // if(err) throw err
                    res.send(result)
                }
                catch(err){
                   
                    res.send(err)
                }
            })
        },
        checkEmail : (req,res)=>{
            
            var email = req.query.email
            console.log(email)
            var sql = `select email from user where email='${email}'`
            db.query(sql, (err, result)=>{
                try{
                    if(err) throw {error:true, msg: 'error in db'}
                   if(result.length>0){
                    var subject = `Change Password`
                    var content = `
                    <div>
                    
                    <p>You request to change password. </p>
                    <h6>Click this <a href='http://localhost:3000/newpassword/${email}'>link</a> to reset your account. </h6>       
                    </div>
                    ` 
                    var mailOptions =sendEmail(subject,email, content)
                    transporter.sendMail(mailOptions,(err,result)=>{
                        if(err) throw {error:true, msg:'error while sending the email'}
                        res.send('send email success')
                    })
                        
                   }else{
                       res.send('Wrong email')
                   }
                }
                catch(err){
                    res.send(err)
                }
            })
        },
    

}