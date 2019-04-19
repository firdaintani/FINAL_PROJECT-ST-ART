const db = require('../database')

module.exports = {
    addToCart : (req,res)=>{
        var data = req.body
        var sql= `select * from cart where username='${data.username}' and product_id=${data.product_id}`
        db.query(sql, (err,result)=>{
            try{
                if(result.length>0){
                    
                var quantity= result[0].quantity+data.quantity
              
                var sql1 = `update cart set quantity=${quantity} where username='${data.username}' and product_id=${data.product_id}`
                db.query(sql1, (err1, result1)=>{
                 
                    if(err1) throw {error : true, msg : "Error while updating quantity"}
                    res.send("success")
                })
                // res.send(result)
                }else{
                var sql2 = `insert into cart set ?`
                db.query(sql2, data, (err2,result2)=>{
                    
                        if(err2) throw {error:true, msg: 'Error in database while inserting data.'}
                        res.send("success")
                    
                })
        
                }
            }
            catch(err){
                res.send(err)
            }
        })
    },
    cartCount : (req,res)=>{
        var username = req.query.username
        var sql = `select count(*) as total_cart from cart where username='${username}'`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg: 'Error in database while retrieving data.'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    },
    getCart : (req,res)=>{
        var username = req.query.username
        var sql = `select cart.id, name,discount, price, quantity, product_image from cart join product on cart.product_id=product.id where username='${username}'`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg: 'Error in database while retrieving data.'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    },
    deleteCart : (req,res)=>{
        var id = req.params.id
        var username = req.query.username
        var sql = `delete from cart where id=${id}`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg : "Error in database while deleting data"}
                var sql1 = `select cart.id, name,discount, price, quantity, product_image from cart join product on cart.product_id=product.id where username='${username}'`
            db.query(sql1, (err1,result1)=>{
                if(err1) throw {error : true, msg : "Error while retrieving data from database"}
                res.send(result1)
            })
            }
            catch(err){
                res.send(err)
            }
        })
    },
    updateQtyCart : (req,res)=>{
        var id = req.params.id
        var quantity = req.body.quantity
        var username = req.body.username
        var sql = `update cart set quantity=${quantity} where id=${id}`
        db.query(sql, (err, result)=>{
         try{
            if(err) throw {error : true, msg : "Error while updating quantity"}
            // res.send("success")
            var sql1 = `select cart.id, name,discount, price, quantity, product_image from cart join product on cart.product_id=product.id where username='${username}'`
            db.query(sql1, (err1,result1)=>{
                if(err1) throw {error : true, msg : "Error while retrieving data from database"}
                res.send(result1)
            })
        }
         catch(err){
             res.send(err)
         }
            
        })

    },
    checkout : (req,res)=>{
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth(); //January is 0!
        var yyyy = today.getFullYear();
        var month=['January','February','March','April','Mei','June','July','August','September','October','November','Desember']
        var order_date = dd+' '+month[mm]+' '+yyyy+' '+today.getHours()+':'+today.getMinutes()
        var data = {...req.body, order_date}
        var sql = `insert into order_user set ?`
        db.query(sql, data , (err,result)=>{
            try{
                if(err) throw {error : true, msg : 'Failed while inserting data'}
                var sql1 = `select cart.id,product_id, quantity, product.price, product.discount from cart join product on cart.product_id=product.id where username='${data.username}'`
                db.query(sql1, (err1, result1)=>{
                    if(err1) throw {error:true, msg : "Error while retrieving data from cart"}
                    var sql2 = `select id from order_user where username='${data.username}' and order_date='${data.order_date}'`
                    db.query(sql2, (err2, result2)=>{
                        if(err2) throw {error:true, msg : "Error while get id from order_user"}
                        var id = result2[0].id
                        var newArr=[]
                        result1.map((val)=>{
                            newArr.push(`(${id},${val.product_id},${val.quantity}, ${val.price-(val.price*(val.discount/100))})`)
                        })
                        var sql3 = `insert into order_item (id_order, id_product, qty, total) VALUES ${newArr.join(',')}`
                        db.query(sql3, (err3,result3)=>{
                            if(err3) throw {error:true, msg : "Error while inserting to ordr item"}
                            var arrId=[]
                            result1.map((val)=>{
                                arrId.push(val.id)
                            })
                            var sql4 = `delete from cart where id in (${arrId.join(',')})`
                            db.query(sql4, (err4,result4)=>{
                                if(err4) throw {error:true, msg : "Error while delete data cart"}
                                res.send('success')
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