var multer = require('multer')
const filterConfig = require('./filterConfigMulter')

const storageConfig = multer.diskStorage({
    // menentukan tempat menyimpan file
    destination : (req,file,cb)=>{
        cb (null, './uploads/product')
    } ,
    // nama file
    filename : (req,file,cb)=>{
        cb(null, '/PRODUCT-'+Date.now()+ '.' + file.mimetype.split('/')[1])
    }
})

var upload = multer({storage : storageConfig, fileFilter : filterConfig})

module.exports=upload
