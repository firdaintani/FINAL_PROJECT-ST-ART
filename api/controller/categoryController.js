var db = require('./../database')
var fs = require('fs')

module.exports={
    getAllCategory: (req,res)=>{
        var sql ='select * from category order by category_name asc'
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
        if(req.file){
            var data = {...JSON.parse(req.body.newData), category_picture : req.file.path}
            var sql1 = `update category set ? where id=${id}`
                        db.query(sql1, data, (err1,result1)=>{
                          
                 try{
                    if(err1) throw {error:true, msg:'error in database'}
                    fs.unlinkSync(req.body.oldImage)
                    var sql2 = `select * from category`
                    db.query(sql2, (err2, result2)=>{ 
                            if(err2) throw {error:true,msg: 'error in database'}
                            res.send(result2)
                    })
                }
                    catch(err){
                        res.send(err)
                    }
                })
        }else{
            var sql1 = `update category set ? where id=${id}`
                        db.query(sql1, req.body, (err1,result1)=>{
                    try{
                    if(err1) throw {error:true, msg:'error in database'}
                    var sql2 = `select * from category`
                        db.query(sql2, (err2, result2)=>{ 
                                if(err2) throw {error:true,msg: 'error in database'}
                                res.send(result2)
                        })
                }
                    catch(err){
                        res.send(err)
                    }
        })
    }
    }
    ,

    addCategory : (req,res)=>{
            var cat = JSON.parse(req.body.data)
        
            var sql = `select * from category where category_name='${cat.category_name}'`
            db.query(sql, (err, result)=>{
                try{
              
                    if(err) throw {error:true, msg:'error in database'}
                    
                    if(result.length===0){
        
                        if(req.validation) throw req.validation
                        if(req.file.size > 5*1024*1024) throw {error:true, msg: 'image too large'}
                        var path = req.file.path.split('\\')
                        
                        var data = {...JSON.parse(req.body.data), category_picture : 'uploads/category/'+path[2]}
                        var sql1 = `insert into category set ?`
                        db.query(sql1, data, (err1,result1)=>{
                           
                                if(err1) throw {error:true,msg:'gagal insert'}
                                
                                res.redirect('/category/all')
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
        var sql = `select category_picture from category where id=${id}`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg:'error while get picture'}
               
                var sql1 = `delete from category where id=${id}`
                db.query(sql1, (err1,result1)=>{
                    if(err1) return res.send({error:true, msg : 'Cant delete because it has products!'})
                    var sql2 = `select * from category`
                    fs.unlinkSync(result[0].category_picture)
                        db.query(sql2, (err2, result2)=>{
                          
                                if(err2) throw {error:true, msg: 'Error in db'}
                                res.send(result2)
                           
                        })
        
                })  

            }
        catch(err){
                res.send(err)
            }
        })
    }
}