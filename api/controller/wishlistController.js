var db = require('./../database')

module.exports={
    getWishlist : (req,res)=>{
        var username = req.params.username
        // console.log(username)
        var sql = `select * from wishlist_view where username='${username}';`
        console.log(sql)
        db.query(sql,(err,result)=>{
            try{
                if(err) throw {error:true, msg:'error while getting data'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    },
    addWishlist : (req,res)=>{
        var data = req.body
        var sql = `insert into wishlist set ?`
        db.query(sql,data,(err,result)=>{
            try{
                if(err) throw err
                res.redirect('/wishlist/all/'+data.username)
            }
            catch(err){
                res.send(err)
            }
        })
    },
    deleteWishlist : (req,res)=>{
        var id = req.params.id
     
        var sql = `delete from wishlist where id=${id}`
        db.query(sql,(err,result)=>{
            try{
                if(err) throw {error:true, msg:'error while delete data'}
                // var sql1 = `select * from show_product_list where id in (select distinct id_product from wishlist);
                // `
                // db.query(sql1,(err1,result1)=>{
                  
                //         if(err1) throw {error:true, msg:'error while getting data'}
                //         res.send(result1)
                 
                // })
                res.send('data deleted!')
            }
            catch(err){
                res.send(err)
            }
        })
    },
    countWishlist:(req,res)=>{
        var username = req.params.username
        var sql = `select count(*) as total from wishlist where username='${username}'`
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
    search :(req,res)=>{
        var searchkey = req.query.s
        var username= req.query.u
        var sql = `select * from wishlist_view where username='${username}' and name like '%${searchkey}%' `
        // console.log(sql)
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
    getProduct:(req,res)=>{
        var username= req.query.u
        var id_product = req.query.id
        var sql = `select id as w_id from wishlist where username = '${username}' and id_product=${id_product}`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw err
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    }
}