var db = require('./../database')

const cryp = require('crypto')


module.exports = {
   
   
    getUser : (req,res)=>{
        var username = req.query.username
        var sql = `select * from user where username='${username}'`
        db.query(sql, (err,result)=>{
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