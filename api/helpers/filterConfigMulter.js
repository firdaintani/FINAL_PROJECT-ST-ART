const filterConfig = (req,file,cb)=>{
    if(file.mimetype.split('/')[1]==='png' || file.mimetype.split('/')[1]==='jpeg'){
        cb(null,true)

    } else{
        req.validation = {error:true, msg : 'File must be image'}
        cb(null,false)
      
    }
}

module.exports=filterConfig