
const express = require('express');
const router = express.Router();
const UserauthController = require('../Controllers/UserauthController');

router.post('/addnewUser', UserauthController.AddnewUser);
router.post('/addnewUser/verify', UserauthController.Verify)
router.get('/addnewUser/resendCode', UserauthController.Verify)
router.post("/login", UserauthController.Login)


module.exports = router