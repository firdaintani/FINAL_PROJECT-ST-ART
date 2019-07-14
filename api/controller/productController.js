var db = require('./../database')
var fs = require('fs')

module.exports={
    getProductList : (req,res)=>{
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

        var data = {...JSON.parse(req.body.data), product_image : 'uploads/product/'+path[2]}
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
       
        // var sql = `select product_image from product where id=${id}`
        var sql = `update product set deleted=1 where id=${id}`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg: 'error in database'}
                // var sql1 = `delete from product where id=${id}`
              
                // db.query(sql1, (err1, result1)=>{
                //     if(err1) return res.send({error:true, msg : 'Cant delete because it is on order or cart data!'})
                  
                    var sql2 = `select * from show_product_list`
                    db.query(sql2, (err2,result2)=>{
                        if(err2) throw {error:true, msg:'error in database'}
                        // fs.unlinkSync(result[0].product_image)
                        res.send(result2)

                    })
                // })
            }
            catch(err){
                res.send(err)
            }
        })
    },
    updateProduct : (req,res)=>{
        var id = req.params.id
       
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
     getAllProduct : (req,res)=>{
         var username = req.query.username
         if(username===undefined) username=''
        // var sql = `select product.id, name, brand.brand_name, price,stock, discount, product_image from product join brand on product.brand_id = brand.id where deleted=0 limit 12 offset ${req.params.page*12};`
        var sql =`select product.id,w_id, name, brand.brand_name, price,stock, discount, product_image from product join brand on product.brand_id = brand.id left join (select id as w_id,id_product from wishlist where username='${username}') as w on product.id=w.id_product where deleted=0 limit 12 offset ${req.query.page*12};
        `

        
        console.log(sql)
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
    getPaging :(req,res)=>{
        

        var sql = `select product.id, name, brand.brand_name, price,stock, discount, product_image from product join brand on product.brand_id = brand.id where deleted=0 limit 12 offset ${req.params.page*12}`
        conn.query(sql, (err,result)=>{
            if(err) throw err
            res.send(result)
        })
    
    },
    getProductDetail : (req,res)=>{
        var id = req.params.id
        var sql = `select product.id, name, brand.brand_name, price, stock,product_image, description, discount from product join brand on product.brand_id=brand.id where product.id=${id}`
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
    search : (req,res)=>{
        var category = req.query.category
        var key = req.query.key
        var brand = req.query.brand
        var price_min = req.query.price_min
        var price_max = req.query.price_max
        var sortby = req.query.sortby
        var page = req.query.page
        var username= req.query.username
        if(username===undefined) username=''
        // console.log(`page ${page}`)
        var link = []
        var newLink = ''
        if(key){
            link.push({
                params : `product.name like '%${key}%'`
            })
        }
        if(category){
            link.push({
                params : 'product.category_id='+category
            })
        }
        if(brand){
            link.push({
                params : 'product.brand_id='+brand
            })
        }
        if(price_min){
            link.push({
                params : '(product.price-(product.price*(product.discount/100)))>='+price_min
            })
        }
        if(price_max){
            link.push({
                params : '(product.price-(product.price*(product.discount/100)))<='+price_max
            })
        }
        

        for(var i =0; i< link.length; i++){
            if(i===0){
              newLink+='where ' + link[i].params
            }else{
              newLink += ' and ' + link[i].params
            }
          }
          newLink+=` and deleted=0`

          if(sortby){
            var sort = sortby.split('-')
            if(sort[0]==='date'){
                newLink+=` order by product.id `+sort[1]        
            }else if(sort[0]==='name'){
                newLink+=` order by product.name `+sort[1]  
            }else{
                newLink+=` order by (product.price-(product.price*(product.discount/100))) `+sort[1]  
                  
            }
        
        }
        newLink+=` limit 12 offset ${page*12}`
        var sql = `select w_id,product.id, name, brand.brand_name, price,stock, discount, product_image from product join brand on product.brand_id = brand.id left join (select id as w_id,id_product from wishlist where username='${username}') as w on product.id=w.id_product  ${newLink};`
        console.log(sql)
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
    productDiscount : (req,res)=>{
        var sql = `select * from show_product_list where discount>0 and stock>0 and deleted=0 order by discount desc`
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
    newArrival : (req,res)=>{
        var sql = `select * from show_product_list where stock>0 and deleted=0 order by id desc limit 10`
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
