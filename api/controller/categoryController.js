var db = require('./../database')

module.exports={
    getAllCategory: (req,res)=>{
        var sql ='select * from category'
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
    editCategory : (req,res)=>{
        var id = req.params.id
        var sql = `select * from category where category_name='${req.body.category_name}'`
        db.query(sql, (err, result)=>{
            try{
                if(err) throw err
                if(result.length===0){
                var sql1 = `update category set ? where id=${id}`
                db.query(sql1, req.body, (err1,result1)=>{
                    try{
                        if(err1) throw err1
                        res.send('success')
                    }
                    catch{
                        res.send('failed to update')
                    }
                })
            }
        }
        catch(err){
            res.send(err.message)
        }
    })
},
    addCategory : (req,res)=>{
        var sql = `select * from category where category_name='${req.body.category_name}'`
        db.query(sql, (err, result)=>{
            try{
                if(err) throw err
                if(result.length===0){
                    var sql1 = `insert into category set ?`
                    db.query(sql1, req.body, (err1,result1)=>{
                        try{
                            if(err1) throw err1
                            var sql2 = `select * from category`
                            db.query(sql2, (err2, result2)=>{
                                try{
                                    if(err2) throw err2
                                    res.send(result2)
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
                }
                else{
                    res.send('category is exist')
                }
    
        }
        catch(err){
            res.send(err.message)
        }
        })
        },
    deleteCategory : (req,res)=>{
        var id = req.params.id
        var sql = `delete from category where id=${id}`
        db.query(sql, (err,result)=>{
            try{
                if(err)throw err
                var sql1 = `select * from category`
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