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



module.exports= { CreateToken }