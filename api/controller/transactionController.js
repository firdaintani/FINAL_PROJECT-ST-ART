const db = require('../database')

module.exports={
    // editStatus : (req,res)=>{
    //     var id = req.params.id
    //     var sql = `update order_user set status=3 where id=${id}`
    //     db.query(sql, (err,result)=>{
    //         try{
    //             if(err) throw {error:true, msg : 'error while updating'}
    //             res.send(result)
    //         }
    //         catch(err){
    //             res.send(err)
    //         }
    //     })
    // },
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
        var sql = `select id, order_date, total from order_user where status='1' and username='${username}' `
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
        var sql = `select id, order_date, total from order_user where status=2 and username='${username}'`
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
      
        var sql = `select id, order_date, total,payment_picture from order_user where status=2`
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
        var sql =` select * from order_user where status=1`
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
    editStatus : (req,res)=>{
        var id = req.params.id
  
        var sql = `update order_user set status=3 where id=${id}`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg: 'error while updating status'}
                var sql1 = `select * from order_user where status=2`
                db.query(sql1, (err1,result1)=>{
                    if(err1) throw {error:true, msg: 'error while retrieving data'}
                    res.send(result1)
                })
            }
            catch(err){
                res.send(err)
            }
        })
    },
    getFinishedTransaction : (req,res)=>{
        var sql =` select * from order_user where status=3`
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
        var sql = ` select id, total, order_date from order_user where status=3 and username='${username}'`
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
            var data = { payment_picture : 'uploads/'+path[1], status:2}
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
    }
    
}