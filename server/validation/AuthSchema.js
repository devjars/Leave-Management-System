const joi  = require("joi")

exports.SignUpSchema  = joi.object({
  email: joi.string().email().required(), 
  password: joi.string().min(8).required(),
  confirmPassword : joi.ref('password')
});

exports.LoginSchema = joi.object({
    email : joi.string().email().required(),
    passwoord : joi.string().required()
})

exports.VerifySchema = joi.object({
    code : joi.string().required()
})
exports.ResendCodeSchema = joi.object({
     email : joi.string().email().required(),
  })