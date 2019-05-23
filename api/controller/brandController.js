var db = require('../database')

module.exports={
    getAllBrand: (req,res)=>{
        var sql ='select * from brand order by brand_name asc'
        db.query(sql,(err,result)=>{
            try{
                if(err) throw {error:true, msg : 'error in database'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    },
    editBrand : (req,res)=>{
        var id = req.params.id
        var sql = `select * from brand where brand_name='${req.body.brand_name}'`
        db.query(sql, (err, result)=>{
            try{
                if(err) throw {error:true, msg:'Brand name not found'}
                if(result.length===0){
                    
                    var sql1 = `update brand set ? where id=${id}`
                    db.query(sql1, req.body, (err1,result1)=>{
                            if(err1) throw {error:true, msg:'Failed while updating'}
                            var sql2 = `select * from brand`
                            db.query(sql2, (err2, result2)=>{
                              
                                    if(err2) throw {error:true, msg : 'Error in database'}
                                    res.send(result2)
                             
                            })
                })
                }else{
                    res.send({error:true, msg : 'Brand name exist'})
                }
        }
        catch(err){
            res.send(err)
        }
        })
    },
    addBrand : (req,res)=>{
      
        var sql = `select * from brand where brand_name="${req.body.brand_name}"`
        db.query(sql, (err, result)=>{
            try{
                if(err) throw {error:true, msg : 'Error in database'}
                if(result.length===0){
                var sql1 = `insert into brand set ?`
                db.query(sql1, req.body, (err1,result1)=>{
                   
                        if(err1) throw {error:true, msg : 'Error while inserting data'}
                        var sql2 = `select * from brand`
                        db.query(sql2, (err2, result2)=>{
                          
                                if(err2) throw {error:true, msg : 'Error while get all'}
                                res.send(result2)
                         
                        })
                  
                    
                })
            }else{
                res.send({error:true, msg : 'Brand name exist'})
            }
        
            }
            catch(err){
                res.send(err)
            }
        })
    },
    deleteBrand : (req,res)=>{
        var id = req.params.id
        var sql = `delete from brand where id=${id}`
        db.query(sql, (err,result)=>{
            try{
                if(err)throw {error:true, msg : 'Cant delete the brand because it has products in products list!'}
                var sql1 = `select * from brand`
                db.query(sql1, (err1, result1)=>{
                        if(err1) throw {error:true, msg : 'Error in database'}
                        res.send(result1)
                })
            }
            catch(err){
                res.send(err)
            }
        })
    },
    selectBrandByCat : (req,res)=>{
        var category_id =req.query.category_id
        var sql = `select brand.id, brand_name from product join brand on product.brand_id=brand.id where product.category_id=${category_id} group by brand.id order by brand_name ASC`
        db.query(sql,(err,result)=>{
            try{
                if(err) throw {error:true, msg : 'error in database'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    
    }
}