var db = require('./../database')
var fs = require('fs')

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
        if(req.file.size > 5*1024*1024) throw {error:true, msg: 'image too large'}
        var path = req.file.path.split('\\')

        var data = {...JSON.parse(req.body.data), product_image : 'uploads/'+path[1]}
        var sql = 'insert into product set ? '
        db.query(sql, data, (err,result)=>{
                
                if (err) throw {error:true, msg : 'error while inserting data'}
                res.send('berhasil')
        })

    }
    catch(err){
        res.send(err)
    }
    },
    deleteProduct : (req,res)=>{
        var id = req.params.id
        var sql = `select product_image from product where id=${id}`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg: 'error in database'}
                fs.unlinkSync(result[0].product_image)

                var sql1 = `delete from product where id=${id}`
        
                db.query(sql1, (err1, result1)=>{
                    if(err1) throw {error:true, msg:'error in database'}
                    var sql2 = `select * from show_product_list`
                    db.query(sql2, (err2,result2)=>{
                        if(err2) throw {error:true, msg:'error in database'}
                        res.send(result2)

                    })
                })
            }
            catch(err){
                res.send(err)
            }
        })
    },
    updateProduct : (req,res)=>{
        var id = req.params.id
        console.log(req.file)
        if(req.file){
            var data = {...JSON.parse(req.body.newData), product_image : req.file.path}
            var sql = `update product set ? where id=${id}`
            db.query(sql, data, (err,result)=>{
                try{
                    if(err) throw {error:true, msg:'error in database while updating data'}
                    fs.unlinkSync(req.body.oldImage)
                    var sql1 = `select * from show_product_list`
                    db.query(sql1, (err1, result1)=>{
                        if(err1) throw {error:true, msg : 'error while get data'}
                        res.send(result1)
                    })
                }
                catch(err){
                    res.send(err)
                }
            })
        }else {
            var sql = `update product set ? where id=${id}`
            db.query(sql, req.body, (err,result)=>{
                try{
                    if (err) throw {error:true, msg : 'error while updating data'}
                    var sql1 = `select * from show_product_list`
                    db.query(sql1, (err1, result1)=>{
                        if(err1) throw {error:true, msg : 'error while get data'}
                        res.send(result1)
                    })
                }
                catch(err){
                    res.send(err)
                }

            })
        }
    },
    getProductList : (req,res)=>{
        var sql = `select product.id, name, brand.brand_name, price, discount, product_image from product join brand on product.brand_id = brand.id;`
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
    getProductDetail : (req,res)=>{
        var id = req.params.id
        var sql = `select product.id, name, brand.brand_name, price, stock,product_image, description from product join brand on product.brand_id=brand.id where product.id=${id}`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg: 'Error in database while retrieving data.'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    }
}
