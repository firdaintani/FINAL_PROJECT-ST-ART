
const sendMail =(subject,email, content)=>{
    return {
        from : 'ST-ART <firdaintani5797@gmail.com>',
        to : email,
        subject : subject,
        html : content
                    
    }
}

module.exports=sendMail