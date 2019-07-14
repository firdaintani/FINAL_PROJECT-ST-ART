const db = require('../database')
const sendEmail= require('../helpers/sendEmail')
const transporter = require('../helpers/nodemailer')
const fs = require('fs')
var hbrs = require('handlebars')
const pdf = require('html-pdf')

module.exports={
  
    getTransactionDetail : (req,res)=>{
        var id = req.query.id
        var sql = `select product_image, name, qty, order_item.total from order_item join product on order_item.id_product=product.id join order_user on order_item.id_order=order_user.id where id_order=${id}
        `

        if(req.query.username!=='admin'){
            sql+=`and username='${req.query.username}'`

        }

       
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg : 'Error while getting data'}
               
                if(result.length===0){
                    res.send('id not exist')
                   
                }else{
                   
                    res.send(result)
                }
            }
            catch(err){
                res.send(err)
            }

        })
    },
    getAddressPaymentDetail : (req,res)=>{
        var sql=`select * from detail_transaction where id=${req.params.id};`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg : 'Error while getting data'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }

        })
    },
    getTransaction : (req,res)=>{
        
        if(req.query.u){
            var sql = ` select id,status, DATE_FORMAT(order_date, "%d %M %Y %H:%i:%s") as order_date, total,DATE_FORMAT(payment_due, "%d %M %Y %H:%i:%s") as payment_due from order_user where username='${req.query.u}' order by id desc `
        }else{
            var sql =` select id,status, DATE_FORMAT(order_date, "%d %M %Y %H:%i:%s") as order_date, total,DATE_FORMAT(payment_due, "%d %M %Y %H:%i:%s") as payment_due,username from order_user order by id desc`
        }
     
                
        db.query(sql, (err,result)=>{
            try{
                if(err) throw err
                
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    },
    confirmPayment : (req,res)=>{
        var id = req.params.id
        var sql = `update order_user set status=3 where id=${id}`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg: 'error while updating status'}
                var sql1 = `select * from for_pdf where id=${id};`
                db.query(sql1, (err1,result1)=>{
                    if(err1) throw {error:true, msg:'error while retrieving order data'}
                    var isitable = []
                    result1.map((val, index) => {
                            isitable.push({no: (index+1), product_name : val.name, quantity: val.qty, total_per_item : val.total})
                    })
                   
                    var address = `${result1[0].address}, ${result1[0].urban}, ${result1[0].sub_district}`
                    var address2 = `${result1[0].city}, ${result1[0].province_name} `
                    var postal_code = result1[0].postal_code
                    var phone = result1[0].phone
                    
                    fs.readFile('./helpers/template/invoice.html', {encoding : 'utf-8'}, (err,readResult)=>{
                        if(err) throw err
                         var template = hbrs.compile(readResult)
                        var data ={name : result1[0].user_name , order_date:result1[0].order_date,id_order:id, total:result1[0].alltotal, tablebody : isitable, address : address, address2 : address2, postal_code : postal_code, phone:phone}
                        var hasilHbrs = template(data)
                        var options = {
                            format : 'A4',
                            orientation : 'potrait',
                            border : {
                                top : "0.3in",
                                bottom : "0.3in",
                                left : "0.3in"
                            }
                        }
                        pdf.create(hasilHbrs,options).toStream((err10,hasilStream)=>{
                            if(err10) throw err10
                            var subject = `ST-ART Payment Confirmed`
                            var content = `
                            <div>
                            <h1>ST-ART Payment Confirmed</h1>
                            
                            <p>Thank you for shopping at ST-ART. Here we attach your purchase invoice : </p>
                                
                            </div>
                            `
                            var mailOptions = sendEmail(subject, result1[0].email, content)
                            mailOptions.attachments =[
                                {
                                    filename : 'invoice.pdf',
                                    content : hasilStream
                                }
                            ]
                            transporter.sendMail(mailOptions, (err6, result6) => {
                                if (err6) throw {
                                    error: true,
                                    msg: 'error while sending the email'
                                }
                               res.send(result)
                            })
                        })
                    })

                    
                })
                
            }
            catch(err){
                res.send(err)
            }
        })
    },

    uploadPayment : (req, res)=>{
        
        try{
            var id = req.params.id
           
            if(req.validation) throw req.validation
            if(req.file.size > 5*1024*1024) throw {error:true, msg: 'image too large'}
            var path = req.file.path.split('\\')
            var data = { payment_picture : 'uploads/payment/'+path[2], status:2}
            var sql = `update order_user set ? where id=${id}`
            db.query(sql, data, (err,result)=>{
                    
                    if (err) throw {error:true, msg : 'error while updating data'}
                    var sql1 =`drop event checkout_${id};`
                    db.query(sql1, (err1, result1)=>{
                        if(err) throw {error:true, msg : 'error while delete event'}
                        res.send('success')
                    })
            })
    
        }
        catch(err){
            res.send(err)
        }
    },
    wrongPicture :(req,res)=>{
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();
        var yyyy = today.getFullYear();
        var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Desember']
        
        var due = (dd+1) + ' ' + month[mm] + ' ' + yyyy + ' ' + today.getHours() + ':' + today.getMinutes()+':'+today.getSeconds()

        var id=req.params.id
        
        var sql = `update order_user set status=1, payment_due=str_to_date('${due}', '%d %M %Y %H:%i:%s') where id=${id}`
            
        db.query(sql, (err,result)=>{
          try{
            if(err) throw {error:true, msg:'error while creating event'}
           

            var sql1= `
            CREATE EVENT checkout_${id}
            ON SCHEDULE AT str_to_date('${due}', '%d %M %Y %H:%i:%s')
            ON COMPLETION NOT PRESERVE
            DO
            BEGIN
                UPDATE order_user set status=4 where id=${id};
                
                CALL update_stock(${id});
                 END ;
            `
                db.query(sql1,(err1, result1)=>{
                    if(err1) throw err1
                    var sql2 = `select email, payment_picture from user join order_user on user.username = order_user.username where order_user.id=${id}`
                    db.query(sql2, (err2,result2)=>{
                        if(err2) throw err2
                        console.log(result2)
                        fs.unlinkSync(result2[0].payment_picture)
                        var subject = `ST-ART Payment Denied (Unclear Picture)`
                        var content = `
                        <div>
                        <h1>Your payment was declined.</h1>
                        <p> Payment is rejected because the proof of payment is unclear. Please upload proof of payment before  ${due}. </p>
                        </div>
                        `
                        var mailOptions =sendEmail(subject, result2[0].email, content)
                        transporter.sendMail(mailOptions,(err3,result3)=>{
                            if(err) throw {error:true, msg:'error while sending the email'}
                           res.send('send email success')
                        })        
                    })
                })
            }
            catch(err){
                res.send(err)
            }
        })
    },
    cancelPayment : (req,res)=>{
        var id = req.params.id
       
        var sql = `select email from user join order_user on user.username = order_user.username where order_user.id=${id}`
        
        db.query(sql, (err,result)=>{
            try{
                if(err) throw err
                var sql1=`update order_user set status=4 where id=${id};`
                db.query(sql1, (err1,result1)=>{
                    if(err1) throw err1
                    var sql2=`call update_stock(${id});`
                    db.query(sql2, (err2, result2)=>{
                        if(err2) throw err2
                     
                        var subject = `ST-ART Payment Denied (Wrong amount transferred)`
                        var content = `
                        <div>
                        <h1>Your payment is canceled because the amount transferred is not appropriate.</h1>
                        </div>
                        `
                        var mailOptions =sendEmail(subject, result[0].email, content)
                        transporter.sendMail(mailOptions,(err,result)=>{
                           
                            if(err) throw {error:true, msg:'error while sending the email'}
                            res.send('success')
                        
                        })
                    })
                })
                
                
            }
            
            catch(err){
                res.send(err)
            }
        })
    },
    
    getTotal : (req,res)=>{
        var sql = `select total,DATE_FORMAT(payment_due, "%d %M %Y %H:%i:%s") as payment_due, account_name, account_number, bank_pict from order_user join payment_account on order_user.payment_bank=payment_account.id where order_user.id=${req.params.id}`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw err
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    },
    bank : (req,res)=>{
        var sql = `select * from payment_account`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg: 'error while gtting payment account'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    },
    search : (req,res)=>{
        var username = req.query.u
        var month = req.query.m
        var year = req.query.y
        var sql = `select id,status, DATE_FORMAT(order_date, "%d %M %Y %H:%i:%s") as order_date, total,DATE_FORMAT(payment_due, "%d %M %Y %H:%i:%s") as payment_due`
        var arr=[]
        var newLink=''
        if(username){
            arr.push(`username='${username}'`)
            
        }else{
            sql+=`,username`
        }
        if(month){
            arr.push(`month(order_date)=${month}`)
        }if(year){
            arr.push(`year(order_date)=${year}`)
        }
        for(var i =0; i< arr.length; i++){
            if(i===0){
              newLink+='where ' + arr[i]
            }else{
              newLink += ' and ' + arr[i]
            }
          }
          
         sql += ` from order_user ${newLink}; `
        //  console.log(sql)
        db.query(sql, (err,result)=>{
            try{
                if(err) throw err
                res.send(result)
                
            }
            catch(err){
                res.send(err)
            }
        })
    },

    getPdf:(req,res)=>{
        // console.log(req.body.title)
        fs.readFile('./helpers/template/report.html', {encoding : 'utf-8'}, (err,readResult)=>{
            try{
                if(err) throw err
                var template = hbrs.compile(readResult)
               var data =req.body
               var hasilHbrs = template(data)
               var options = {
                   format : 'A4',
                   orientation : 'potrait',
                   border : {
                       top : "0.3in",
                       bottom : "0.3in",
                       left : "0.3in"
                   }
               }
                pdf.create(hasilHbrs, options).toFile('./pdf/report.pdf', (err1, hasilPdf)=>{
                if(err) throw err
                console.log(hasilPdf)
                res.send({path:'/pdf/report.pdf'})

                })
   
            }
            catch(err){
                res.send(err)
            }
        })
    
    },
    getTransactionDatabyUser : (req,res)=>{
        var username= req.query.username
        var id = req.query.id
        console.log(id)
        console.log(username)
        
        var sql = `select id from order_user where id=${id} and username='${username}'`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw err
                if(res.length===0){
                    res.send('false')
                    console.log('kosong')
                    console.log(result)

                }
                
                else{ res.send('true')
                console.log('ada')
                console.log(result)
            }
                
            }
            catch(err){
                res.send(err)
            }
        })
    }
  
}