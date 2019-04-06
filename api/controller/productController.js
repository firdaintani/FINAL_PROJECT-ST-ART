var db = require('./../database')

module.exports={
    getAllProduct : (req,res)=>{
        var sql = `select * from product`
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
    }
}