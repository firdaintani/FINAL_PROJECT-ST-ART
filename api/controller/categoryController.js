var db = require('./../database')

module.exports={
    getAllCategory: (req,res)=>{
        var sql ='select * from category'
        db.query(sql,(err,result)=>{
            try{
                if(err) throw {error : true, msg:'error in database'}
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
                if(err) throw {error : true, msg:'error in database'}
                if(result.length===0){
                var sql1 = `update category set ? where id=${id}`
                db.query(sql1, req.body, (err1,result1)=>{
                    // console.log('masuk update')
                        if(err1) throw {error:true, msg:'error in database'}
                        var sql2 = `select * from category`
                        db.query(sql2, (err2, result2)=>{ 
                                if(err2) throw {error:true,msg: 'error in database'}
                                res.send(result2)
                        })
                   
                   
                })
            }else{
                res.send({error:true, msg:'Category exist'})
            }
        }
        catch(err){
            res.send(err)
        }
    })
},
    addCategory : (req,res)=>{
        var sql = `select * from category where category_name='${req.body.category_name}'`
        db.query(sql, (err, result)=>{
            try{
                if(err) throw {error:true, msg:'error in database'}
                if(result.length===0){
                    var sql1 = `insert into category set ?`
                    db.query(sql1, req.body, (err1,result1)=>{
                       
                            if(err1) throw {error:true,msg:'category exist'}
                            var sql2 = `select * from category`
                            db.query(sql2, (err2, result2)=>{ 
                                    if(err2) throw {error:true,msg: 'error in database'}
                                    res.send(result2)
                            })
                       })
                }
                else{
                    res.send({error:true,msg:'category exist'})
                }
    
        }
        catch(err){
            res.send(err)
        }
        })
        },
    deleteCategory : (req,res)=>{
        var id = req.params.id
        var sql = `delete from category where id=${id}`
        db.query(sql, (err,result)=>{
            try{
                if(err)throw {error:true, msg: 'category not found'}
                var sql1 = `select * from category`
                db.query(sql1, (err1, result1)=>{
                  
                        if(err1) throw {error:true, msg: 'error in database'}
                        res.send(result1)
                   
                })
            }
            catch(err){
                res.send(err)
            }
        })
    }
}