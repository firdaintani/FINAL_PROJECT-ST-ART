var db = require('./../database')
var fs = require('fs')

module.exports={
    getAllCategory: (req,res)=>{
        var sql ='select * from category order by category_name asc'
        db.query(sql,(err,result)=>{
            try{
                if(err) throw {error : true, msg:'error in database'}
                // console.log('masuk')
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
                            // console.log('masuk update')
                 try{
                    if(err1) throw {error:true, msg:'error in database'}
                    fs.unlinkSync(req.body.oldImage)
                    var sql2 = `select * from category`
                    db.query(sql2, (err2, result2)=>{ 
                            if(err2) throw {error:true,msg: 'error in database'}
                            res.send(result2)
                    })
                    // res.redirect('/category/all')
                    // console.log('udah')
                }
                    catch(err){
                        res.send(err)
                    }
                })
        }else{
            var sql1 = `update category set ? where id=${id}`
                        db.query(sql1, req.body, (err1,result1)=>{
                            // console.log('masuk update')
                 try{
                    if(err1) throw {error:true, msg:'error in database'}
                    // res.redirect('/category/all')
                    // console.log('masuksini')
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
    //     var sql = `select * from category where category_name='${req.body.category_name}'`
    //     db.query(sql, (err, result)=>{
    //         try{
    //             if(err) throw {error : true, msg:'error in database'}
    //             if(result.length===0){
    //             var sql1 = `update category set ? where id=${id}`
    //             db.query(sql1, req.body, (err1,result1)=>{
    //                 // console.log('masuk update')
    //                     if(err1) throw {error:true, msg:'error in database'}
    //                     var sql2 = `select * from category`
    //                     db.query(sql2, (err2, result2)=>{ 
    //                             if(err2) throw {error:true,msg: 'error in database'}
    //                             res.send(result2)
    //                     })
                   
                   
    //             })
    //         }else{
    //             res.send({error:true, msg:'Category exist'})
    //         }
    //     }
    //     catch(err){
    //         res.send(err)
    //     }
    // })

    addCategory : (req,res)=>{
            var cat = JSON.parse(req.body.data)
            // console.log(cat.category_name)
            var sql = `select * from category where category_name='${cat.category_name}'`
            db.query(sql, (err, result)=>{
                try{
              
                    if(err) throw {error:true, msg:'error in database'}
                    // if(err) throw err
                    if(result.length===0){
        
                        if(req.validation) throw req.validation
                        if(req.file.size > 5*1024*1024) throw {error:true, msg: 'image too large'}
                        var path = req.file.path.split('\\')
                        
                        var data = {...JSON.parse(req.body.data), category_picture : 'uploads/category/'+path[2]}
                        var sql1 = `insert into category set ?`
                        db.query(sql1, data, (err1,result1)=>{
                           
                                if(err1) throw {error:true,msg:'gagal insert'}
                                // if(err1) throw err1
                                
                                res.redirect('/category/all')
                           })
                    }
                    else{
                        res.send({error:true,msg:'category exist'})
                        // console.log('ada ')
                    }
        
                }
                catch(err){
                    res.send(err)
                    // console.log(err)
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