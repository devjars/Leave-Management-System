const jwt = require("jsonwebtoken")

const CreateToken = (data) =>{

    const Payload={
        id : data.user_id,
        email: data.email,
        role : data.role

    }

    const Token = jwt.sign(Payload,process.env.JWT_SECRET_KEY,{ expiresIn: "7d" })
    return Token
}

const ValidateToken = (req,res,next)=>{

    const Token = req.cookies?.['Access-Token']

    if(!Token){
        return res.status(401).json({ success : false , message : "User not Authenticated   "})
    }

    jwt.verify(Token,process.env.JWT_SECRET_KEY,(err,payload)=>{
        if(err){
            return res.statos(403).json({ success : false,  message: "Token is invalid or expired" })
        }

       

        req.credentials = payload
        next()
    })

}



module.exports= { CreateToken,ValidateToken }