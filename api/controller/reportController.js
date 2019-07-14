const db = require('../database')

module.exports={
    getMostBuyItem : (req,res)=>{
        var sql = `select name, sum(qty) as total from order_item oi join product p on oi.id_product=p.id join order_user ou on oi.id_order=ou.id where status=3 group by id_product order by total desc; 
        `
        db.query(sql, (err,result)=>{
            try{
                if(err) throw err
                res.send(result)
            }
            catch(err){
                console.log(err)
            }
        })
    },
    MostBuyUser : (req,res)=>{
        var sql = `select username,sum(qty) as total_buy from order_item oi join order_user ou on oi.id_order=ou.id group by username order by total_buy desc`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw err
                res.send(result)
            }
            catch(err){
                console.log(err)
            }
        })
    },
    SeringBuy :(req,res)=>{
        var sql = `select username,count(username) as times_buy from order_user group by username order by times_buy desc;
        `
        db.query(sql, (err,result)=>{
            try{
                if(err) throw err
                res.send(result)
            }
            catch(err){
                console.log(err)
            }
        })
    },
    getPdf:(req,res)=>{
        
    }
}