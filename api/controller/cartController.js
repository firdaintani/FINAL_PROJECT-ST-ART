const db = require('../database')
const sendEmail = require('../helpers/sendEmail')
const transporter = require('../helpers/nodemailer')


module.exports = {
    addToCart: (req, res) => {
        var data = req.body
        var sql = `select * from cart where username='${data.username}' and product_id=${data.product_id}`
        db.query(sql, (err, result) => {
            try {
                if (result.length > 0) {

                    var quantity = result[0].quantity + data.quantity

                    var sql1 = `update cart set quantity=${quantity} where username='${data.username}' and product_id=${data.product_id}`
                    db.query(sql1, (err1, result1) => {

                        if (err1) throw {
                            error: true,
                            msg: "Error while updating quantity"
                        }
                        res.send("success")
                    })
                    // res.send(result)
                } else {
                    var sql2 = `insert into cart set ?`
                    db.query(sql2, data, (err2, result2) => {

                        if (err2) throw {
                            error: true,
                            msg: 'Error in database while inserting data.'
                        }
                        res.send("success")

                    })

                }
            } catch (err) {
                res.send(err)
            }
        })
    },
    cartCount: (req, res) => {
        var username = req.query.username
        var sql = `select count(*) as total_cart from cart where username='${username}'`
        db.query(sql, (err, result) => {
            try {
                if (err) throw {
                    error: true,
                    msg: 'Error in database while retrieving data.'
                }
                res.send(result)
            } catch (err) {
                res.send(err)
            }
        })
    },
    getCart: (req, res) => {
        var username = req.query.username
        var sql = `select cart.id, name,discount, price, quantity, product_image,stock from cart join product on cart.product_id=product.id where username='${username}'`
        db.query(sql, (err, result) => {
            try {
                if (err) throw {
                    error: true,
                    msg: 'Error in database while retrieving data.'
                }
                res.send(result)
            } catch (err) {
                res.send(err)
            }
        })
    },
    deleteCart: (req, res) => {
        var id = req.params.id
        var username = req.query.username
        var sql = `delete from cart where id=${id}`
        db.query(sql, (err, result) => {
            try {
                if (err) throw {
                    error: true,
                    msg: "Error in database while deleting data"
                }
                var sql1 = `select cart.id, name,discount, price, quantity,stock, product_image from cart join product on cart.product_id=product.id where username='${username}'`
                db.query(sql1, (err1, result1) => {
                    if (err1) throw {
                        error: true,
                        msg: "Error while retrieving data from database"
                    }
                    res.send(result1)
                })
            } catch (err) {
                res.send(err)
            }
        })
    },
    updateQtyCart: (req, res) => {
        var id = req.params.id
        var quantity = req.body.quantity
        var username = req.body.username
        var sql = `update cart set quantity=${quantity} where id=${id}`
        db.query(sql, (err, result) => {
            try {
                if (err) throw {
                    error: true,
                    msg: "Error while updating quantity"
                }
                // res.send("success")
                var sql1 = `select cart.id, name,discount, price, quantity, product_image, stock from cart join product on cart.product_id=product.id where username='${username}'`
                db.query(sql1, (err1, result1) => {
                    if (err1) throw {
                        error: true,
                        msg: "Error while retrieving data from database"
                    }
                    res.send(result1)
                })
            } catch (err) {
                res.send(err)
            }

        })

    },
    checkout: (req, res) => {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();
        var yyyy = today.getFullYear();
        var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Desember']
        var order_date = dd + ' ' + (mm+1) + ' ' + yyyy + ' ' + today.getHours() + ':' + today.getMinutes()+':'+today.getSeconds()
        var payment_due = (dd+2) + ' ' + month[mm] + ' ' + yyyy + ' ' + today.getHours() + ':' + today.getMinutes()+':'+today.getSeconds()

        var data = req.body
        var sql = `insert into order_user (username, total, idAddress, address, order_date, payment_due, payment_bank) VALUE ('${data.username}', ${data.total}, ${data.idAddress}, '${data.address}', str_to_date('${order_date}', '%d %m %Y %H:%i:%s'), str_to_date('${payment_due}', '%d %M %Y %H:%i:%s'), ${data.payment_bank})`
        db.query(sql, (err, result) => {
            try {
                if (err) throw {
                    error: true,
                    msg: 'Failed while inserting data'
                    // msg : err
                }
                // if(err) console.log(err)
                var sql1 = `select cart.id,product_id,product.name, quantity, product.price, product.discount, product.stock from cart join product on cart.product_id=product.id where username='${data.username}'`
                db.query(sql1, (err1, result1) => {
                    if (err1) throw {
                        error: true,
                        msg: "Error while retrieving data from cart"
                    }
                    var sql2 = `select id from order_user where username='${data.username}' and order_date=str_to_date('${order_date}', '%d %m %Y %H:%i:%s')`
                    db.query(sql2, (err2, result2) => {
                        if (err2) throw {
                            error: true,
                            msg: "Error while get id from order_user"
                        }
                        var id = result2[0].id
                        var newArr = []
                    
                        result1.map((val) => {
                            if(val.stock > 0){
                                newArr.push(`(${id},${val.product_id},${val.quantity}, ${val.price-(val.price*(val.discount/100))})`)
                                
                            }
                        })
    
                        var sql3 = `insert into order_item (id_order, id_product, qty, total) VALUES ${newArr.join(',')}`
                        db.query(sql3, (err3,result3)=>{
                            if (err3) throw {
                                error: true,
                                 msg: "Error while inserting to order item"
                            }
                            var arrId = []
                            result1.map((val) => {
                                arrId.push(val.id)
                            })

                            var sql4 = `delete from cart where id in (${arrId.join(',')})`
                            db.query(sql4, (err4, result4) => {
                                if (err4) throw {
                                    error: true,
                                    msg: "Error while delete data cart"
                                }
                 
                                var sql5 = `select email from user where username='${data.username}'`
                                db.query(sql5, (err5, result5) => {
                                    if (err5) throw {
                                        error: true,
                                        msg: "Error while get email"
                                    }
                                            var subject = `ST-ART Checkout Success`
                                            var content = `
                                            <div>
                                            <h1>ST-ART Checkout Success</h1>
                                            <h3>The total payment is : <strong>Rp. ${data.total}</strong> </h3>
                                            <p>Immediately pay your purchases and send the picture of your payment before ${payment_due} so the transaction can be processed. </p>
                                            <p>Click this <a href='http://localhost:3000/transaction-detail/${id}'>link</a> to upload your payment picture </p>        
                                            </div>
                                            `
                                            var mailOptions = sendEmail(subject, result5[0].email, content)
                                            transporter.sendMail(mailOptions, (err6, result6) => {
                                                if (err6) throw {
                                                    error: true,
                                                    msg: 'error while sending the email'
                                                }
                                                var sql6= `
                                                CREATE EVENT checkout_${id}
                                                ON SCHEDULE AT str_to_date('${payment_due}', '%d %M %Y %H:%i:%s')
                                                ON COMPLETION NOT PRESERVE
                                                DO
                                                BEGIN
                                                delete from order_item where id_order=${id};
                                                delete from order_user where id=${id};
                                                END ;
                                                `
                               
                                                db.query(sql6, (err7,result7)=>{
                                                    if(err7) throw err7
                                                    res.send({id_order: id})
                                                    
                                                })
                                            })
        
                                    })

                            })
                        })
                    })
                })
            } catch (err) {
                res.send(err)
            }
        })
    },

    
}