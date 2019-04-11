var db = require('./../database')

module.exports={
    getAllProduct : (req,res)=>{
        // var sql = `select * from product`
        var sql = `select * from show_product_list`
        
        db.query(sql,(err,result)=>{
            try{
                if(err) throw {error:true, msg:'error in database'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    },
    editProduct : (req,res)=>{
        var data = req.body
        var id = req.params.id
        var sql = `update product set ? where id=${id}`
        db.query(sql,data, (err,result)=>{
            try{
                if(err) throw err
                res.send('success')

            }
            catch{
                res.send('failed')
            }
        } )
    },
    addProduct : (req,res)=>{
    try{
        if(req.validation) throw req.validation
        if(req.file.size > 5*1024) throw {error:true, msg: 'image too large'}
        
        var data = {...JSON.parse(req.body.data), product_image : req.file.path}
        var sql = 'insert into product set ? '
        db.query(sql, data, (err,result)=>{
                
                if (err) throw {error:true, msg : 'error while inserting data'}
                // var sql2 = 'select * from product'
                // db.query(sql2, (err2,result2)=>{
                //         if(err2) throw {error:true, msg: 'error in db while retrieving data'}
                //         res.send(result2)
                // })
        
        })

    }
    catch(err){
        res.send(err)
    }

    },
    deleteProduct : (req,res)=>{
        var id = req.params.id
        var sql = `delete from product where id=${id}`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg: 'error in database'}
                var sql1 = `select * from show_product_list`
                db.query(sql1, (err1, result1)=>{
                    if(err1) throw {error:true, msg:'error in database'}
                    res.send(result1)
                })
            }
            catch(err){
                res.send(err)
            }
        })
    }
}
