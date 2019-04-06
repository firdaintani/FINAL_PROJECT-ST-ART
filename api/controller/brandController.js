var db = require('../database')

module.exports={
    getAllBrand: (req,res)=>{
        var sql ='select * from brand'
        db.query(sql,(err,result)=>{
            try{
                if(err) throw err
                res.send(result)
            }
            catch{
                res.send(err)
            }
        })
    },
    editBrand : (req,res)=>{
        var id = req.params.id
        // var brand_name = req.body.brand_name
        var sql = `select * from brand where brand_name='${req.body.brand_name}'`
        db.query(sql, (err, result)=>{
            try{
                if(err) throw err
                if(result.length===0){
                    
                var sql1 = `update brand set ? where id=${id}`
                db.query(sql1, req.body, (err1,result1)=>{
                    try{
                        if(err1) throw err1
                        res.send('success')
                    }
                    catch(err1){
                        res.send('failed to update')
                    }
                })
                }else{
                    res.send('brand name is exist')
                }
        }
        catch(err){
            res.send(err.message)
        }
        })
    },
    addBrand : (req,res)=>{
        
        var sql = `select * from brand where brand_name='${req.body.brand_name}'`
        db.query(sql, (err, result)=>{
            try{
                if(err) throw err
                if(result.length===0){
                var sql1 = `insert into brand set ?`
                db.query(sql1, req.body, (err1,result1)=>{
                    try{
                        if(err1) throw err1
                        var sql2 = `select * from brand`
                        db.query(sql2, (err2, result2)=>{
                            try{
                                if(err2) throw err2
                                res.send(result1)
                            }
                            catch(err2){
                                res.send(err2.message)
                            }
                        })
                    }
                    catch(err1){
                        res.send(err1.message)
                    }
                    
                })
            }else{
                res.send('brand name is exist')
            }
        
            }
            catch(err){
                res.send(err.message)
            }
        })
    },
    deleteBrand : (req,res)=>{
        var id = req.params.id
        var sql = `delete from brand where id=${id}`
        db.query(sql, (err,result)=>{
            try{
                if(err)throw err
                var sql1 = `select * from brand`
                db.query(sql1, (err1, result1)=>{
                    try{
                        if(err1) throw err1
                        res.send(result1)
                    }
                    catch(err1){
                        res.send(err1.message)
                    }
                })
            }
            catch(err){
                res.send(err.message)
            }
        })
    }
}