
const express = require('express');
const router = express.Router();
const UserauthController = require('../Controllers/UserauthController');
const ValidateRequest = require("../Middleware/ValidateRequest")
const AuthSchema = require("../validation/AuthSchema")
const { ValidateToken } = require("../Middleware/Jwt")

router.post('/addnewUser', ValidateRequest(AuthSchema.SignUpSchema),  UserauthController.AddnewUser);
router.post('/addnewUser/verify',ValidateToken, ValidateRequest(AuthSchema.VerifySchema), UserauthController.Verify)
router.get('/addnewUser/resendCode', ValidateRequest(AuthSchema.ResendCodeSchema,'query'), UserauthController.GetnewCode)
router.post('/addnewUser/checkunverified', ValidateToken, UserauthController.ChecknotVerified)

router.post("/login", ValidateRequest(AuthSchema.LoginSchema), UserauthController.Login)


module.exports = router