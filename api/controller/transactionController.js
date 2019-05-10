const db = require('../database')
const sendEmail= require('../helpers/sendEmail')
const transporter = require('../helpers/nodemailer')
const fs = require('fs')
var hbrs = require('handlebars')
const pdf = require('html-pdf')

module.exports={
  
    getTransactionDetail : (req,res)=>{
        var id = req.params.id
        var sql = `select product_image, name, qty, total from order_item join product on order_item.id_product=product.id where id_order=${id}`
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
    getTransactionByUsername : (req,res)=>{
        var username = req.query.username
        var sql = `select id, order_date, total, payment_due from order_user where status='1' and username='${username}' order by id desc `
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
    getOnProcessTransactionByUsername : (req,res)=>{
        var username = req.query.username
        var sql = `select id, order_date, total from order_user where status=2 and username='${username}' order by id desc`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg : 'Error while getting data'}
                
                res.send(result)
               
            }
            catch(err){
                res.send(err)
            }
        })
    },getOnProcessTransaction : (req,res)=>{
      
        var sql = `select id, order_date, total,payment_picture from order_user where status=2 order by id desc`
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
        var sql =` select * from order_user where status=1 order by id desc`
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
                var sql1 = `select user.username,email, order_date,order_user.total as alltotal, product.name, qty, order_item.total from order_item join product on order_item.id_product=product.id join order_user on order_user.id=order_item.id_order join user on order_user.username=user.username where id_order=${id};
                `
                db.query(sql1, (err1,result1)=>{
                    if(err1) throw {error:true, msg:'error while retrieving order data'}
                    var isitable = []
                    result1.map((val, index) => {
                            isitable.push({no: (index+1), product_name : val.name, quantity: val.qty, total_per_item : val.total})
                    })
                    fs.readFile('./helpers/template/invoice.html', {encoding : 'utf-8'}, (err,readResult)=>{
                        if(err) throw err
                       console.log(readResult)
                        var template = hbrs.compile(readResult)
                        var data ={name : result1[0].username , order_date:result1[0].order_date,id_order:id, total:result1[0].alltotal, tablebody : isitable}
                        var hasilHbrs = template(data)
                        console.log(isitable)
                        // res.send(hasilHbrs)
                        var options = {
                            format : 'A4',
                            orientation : 'potrait',
                            border : {
                                top : "0.3in",
                                bottom : "0.3in",
                                // right : "0.3in",
                                left : "0.3in"
                            }
                        }
                        pdf.create(hasilHbrs,options).toStream((err10,hasilStream)=>{
                            // console.log(hasilStream)
                            if(err10) throw err10
                            var subject = `ST-ART Payment Confirmed`
                            var content = `
                            <div>
                            <h1>ST-ART Payment Confirmed</h1>
                            
                            <p>Terima kasih sudah berbelanja di ST-ART. Berikut kami lampirkan Invoice pembelanjaan anda : </p>
                                
                            </div>
                            `
                            // var content = require('../helpers/template/invoice.html')
                            var mailOptions = sendEmail(subject, result1[0].email, content)
                            mailOptions.attachments =[
                                {
                                    filename : 'invoice.pdf',
                                    content : hasilStream
                                }
                            ]
                            // console.log(mailOptions)
                            transporter.sendMail(mailOptions, (err6, result6) => {
                                if (err6) throw {
                                    error: true,
                                    msg: 'error while sending the email'
                                }
                                var sql2 = `select * from order_user where status=3`
                                db.query(sql2, (err2,result2)=>{
                                    if(err1) throw {error:true, msg: 'error while retrieving data'}
                                    res.send(result2)
                                })
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
    getFinishedTransaction : (req,res)=>{
        var sql =` select * from order_user where status=3 order by id desc`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg : 'error in db'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    }, 
    getFinishedTransactionUser : (req,res)=>{
        var username = req.query.username
        var sql = ` select id, total, order_date from order_user where status=3 and username='${username}' order by id desc`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg : 'error in db'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    
    },

    deleteTransaction: (req,res)=>{
        var id = req.params.id
        var sql = `delete from order_item where id_order=${id}`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error: true, msg : "error while deleting from order item"}
                var sql1 = `delete from order_user where id=${id}`
                db.query(sql1, (err1,result1)=>{
                    if(err1) throw {error: true, msg : "error while deleting from order user"}
                    res.send('success')
                })
            }
            catch(err){
                res.send(err)
            }
        })
    },
    countnewTransaction : (req,res)=>{
        var sql =`select count(*) from order_user where read=1`
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
    uploadPayment : (req, res)=>{
        
        try{
            var id = req.params.id
            console.log(id)
            if(req.validation) throw req.validation
            if(req.file.size > 5*1024*1024) throw {error:true, msg: 'image too large'}
            var path = req.file.path.split('\\')
            // console.log('masuk')
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
    cancelPayment : (req,res)=>{
        var id = req.params.id
        var sql = `update order_user set status=1 where id=${id}`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw err
                var sql1 = `select email from user join order_user on user.username = order_user.username where order_user.id=${id}`
                db.query(sql1,(err1,result1)=>{
                    if(err1) throw {error:true, msg : 'error while selecting email'}
                    var subject = `ST-ART Payment Denied`
                    var content = `
                    <div>
                    <h1>Pembayaran anda dibatalkan. Silahkan upload kembali bukti pembayaran</h1>
                    </div>
                    `
                    var mailOptions =sendEmail(subject, result1[0].email, content)
                    transporter.sendMail(mailOptions,(err,result)=>{
                        if(err) throw {error:true, msg:'error while sending the email'}
                        var sql2= `
                            CREATE EVENT checkout_${id}
                            ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 2 day
                            ON COMPLETION NOT PRESERVE
                            DO
                            BEGIN
                            delete from order_item where id_order=${id};
                            delete from order_user where id=${id};
                            END ;
                            `
                            db.query(sql2, (err2,result2)=>{
                                if(err2) throw {error:true, msg:'error while creating event'}
                                var sql3 = `select id, order_date, total,payment_picture from order_user where status=2 order by id desc`
                                db.query(sql3, (err3, result3)=>{
                                    if(err2) throw {error : true, msg : 'error while getting all data'}
                                    res.send(result3)
                        })
                    })
                })
                })
            }
            catch(err){
                res.send(err)
            }
        })
    }
    
}