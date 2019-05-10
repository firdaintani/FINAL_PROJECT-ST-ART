const db = require('../database')

module.exports={
    search : (req,res)=>{
        var category = req.query.category
        var key = req.query.key
        var brand = req.query.brand
        var price_min = req.query.price_min
        var price_max = req.query.price_max

        var link = []
        var newLink = ''
        if(key){
            link.push({
                params : `product.name like '%${key}%'`
            })
        }
        if(category){
            link.push({
                params : 'product.category_id='+category
            })
        }
        if(brand){
            link.push({
                params : 'product.brand_id='+brand
            })
        }
        if(price_min){
            link.push({
                params : 'product.price>'+price_min
            })
        }
        if(price_max){
            link.push({
                params : 'product.price<'+price_max
            })
        }
        

        for(var i =0; i< link.length; i++){
            if(i===0){
              newLink+='where ' + link[i].params
            }else{
              newLink += ' and ' + link[i].params
            }
          }
        //   console.log(newLink)
        // console.log('masuk')
        var sql = `select product.id, name, brand.brand_name, price,stock, discount, product_image from product join brand on product.brand_id = brand.id ${newLink};`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg: 'Error in database while retrieving data.'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    
    }
}