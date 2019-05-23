const db = require('./../database')

module.exports={
    getAllProvince:(req,res)=>{
        var sql = `select province_name, province_code from db_province_data order by province_name`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg :'error while get province data'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    },
    getCity : (req,res)=>{
        var province_code = req.params.code
        var sql = `select city from db_postal_code_data where province_code=${province_code} group by city order by city asc`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg :'error while get city data'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    },
    getKecamatan : (req,res)=>{
        var city = req.params.city
        var sql = `select sub_district from db_postal_code_data where city='${city}' group by sub_district order by sub_district asc`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg :'error while get sub_district data'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    },
    getDesa :(req,res)=>{
        var sub_district = req.params.sub
        var sql = `select urban from db_postal_code_data where sub_district='${sub_district}' group by urban order by urban asc`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg :'error while get urban data'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    },
    getPostalCode : (req,res)=>{
        var urban = req.query.urban
        var sub = req.query.sub
        var sql = `select postal_code, id from db_postal_code_data where urban='${urban}' and sub_district='${sub}'`
        db.query(sql, (err,result)=>{
            try{
                if(err) throw {error:true, msg :'error while get urban data'}
                res.send(result)
            }
            catch(err){
                res.send(err)
            }
        })
    },
}