// const verify =(username,email,code_verify)=>{
//     return {
//         from : 'ST-ART <purwadhika@purwadhika.com>',
//         to : email,
//         subject : 'Please Verify your email',
//         html :  `
//         <div>
//         <h1>Please verify your account with the code.</h1>
//         <p>your code is : <strong>${code_verify}</strong> </p>
//         <h3>Click this <a href='http://localhost:3000/verify?username=${username}'>link</a> to verify your account </h3>
        
//         </div>
//         `
                    
//     }
// }
const sendMail =(subject,email, content)=>{
    return {
        from : 'ST-ART <purwadhika@purwadhika.com>',
        to : email,
        subject : subject,
        html : content
                    
    }
}

module.exports=sendMail