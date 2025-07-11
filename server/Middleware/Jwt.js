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

    const accessToken  = req.cookie(["Access-Token"], process.env.JWT_SECRET_KEY)
    if(!accessToken){
        return res.status(401).json({ success : false , message : "User not Authenticated   "})
    }
}



module.exports= { CreateToken }