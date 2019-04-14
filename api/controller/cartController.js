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

    }
}