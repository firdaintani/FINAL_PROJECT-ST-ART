const db = require('../database')

module.exports={
    editStatus : (req,res)=>{
        var id = req.params.id
        var sql = `update order_user set status=1 where id=${id}`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg : 'error while updating'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    },
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
        var sql = `select id, order_date, total, status from order_user where username='${username}'`
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
        var sql =` select * from order_user where status=0`
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
        status = req.body.status
        var sql = `update order_user set status=${status} where id=${id}`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg: 'error while updating status'}
                var sql1 = `select * from order_user where status=0 `
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
    }
}