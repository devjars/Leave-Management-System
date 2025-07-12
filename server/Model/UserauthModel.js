const db = require('../config/db');
const bcrypt = require('bcrypt');
const SendMail = require('../utils/Mailsender')


exports.ResendCode = async (email) => {
  try {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    const query = `UPDATE user SET code = ?, code_expiry = ? WHERE email = ?`;
    const res = await db(query, [newCode, expiry, email]);

    if (res.affectedRows > 0) {
    
      await SendMail( email, "Verefication Code", `<p>Your Virefication code is ${newCode}</p>`)

      return { success: true, message : "Verification code is sent to your email"};
    } else {
      return { success: false, message: "Failed to send Verification code" };
    }
  } catch (error) {
    console.error("ResendCode error:", error);
    return { success: false, message: "Something went wrong" };
  }
};

exports.createUser = async (email, password) => {
 
  try {
    const checkquery = "SELECT  is_verified, user_id,email,role FROM user WHERE email = ?"
    const checkres = await db(checkquery,[email])
    const user = checkres[0]

    if(user  && !user.is_verified){
    const result =  await this.ResendCode(email)
        if(result.success){
          const { user_id:dbuser_id , email:dbemail , role:dbrole} = user
          const credentials = {user_id : dbuser_id , email : dbemail , role : dbrole }

          return { success : true , message : result.message , payload :credentials }
        }

    }
    if(user && user.is_verified){
      return {success : false , message : "Account Already Exist"}
    }

     const hashedPassword = await bcrypt.hash(password, 10);
      const code = Math.floor(100000 + Math.random() * 900000).toString(); 
     const expiry = new Date(Date.now() + 10 * 60 * 1000); 
    const query = `INSERT INTO user (email, password, code, code_expiry) VALUES (?, ?, ?, ?)`;
    const res = await db(query, [email, hashedPassword, code, expiry]);
    if (res.affectedRows > 0) {
      const queryForpayload = `SELECT user_id , email , role FROM user WHERE email = ?`
      const result = await db(queryForpayload,[email])

      if(result.length > 0){
               await SendMail( email, "Verefication Code", `<p>Your Virefication code is ${code}</p>`)
          return { success: true,
               message : 'User created successfully. Please check your email for the verification code.' , 
              payload : result[0] };
      }
    
    } else {
      return { success: false, message : "Sign in Failed" };
    }
  }catch (error) {
  console.error("CreateUser error:", error);
  return { success: false, message: error.message };
}
};

exports.Verify = async (email, code) => {
  
  try{
    const checkquery = `SELECT email , code , code_expiry, is_verified  FROM user WHERE email = ? `
    const checkres = await db(checkquery,[email])

    if(checkres.length === 0){
      return { success : false , message : "User not Found"}
    }

    const user = checkres[0]
    const now = new Date()

    if(new Date(user.code_expiry) < now){
      return { success : false , message : "The Verification code is Already Expired"}
    }
   
    if(code !== user.code){
      return {success : false , message : "Incorrect Verification Code , Please Try Again!"}
    }

    const querytoUpdate = `UPDATE user SET code_expiry = NULL , code = NULL, is_verified = true WHERE email = ?`
    const querytoUpdateres = await db(querytoUpdate,[email])
      if(querytoUpdateres.affectedRows > 0){
      
        return { success : true , message : "Sign up Successfully" }
      }else{
        return { success : false , message : "Code Verification Failed! Please try Again !"}
      }
    

  }catch(error){
    console.log("Error Verifying the code",error.message) 
    return { success : false, message : "Internal server error"}
  }
};


exports.Login = async (email,password)=>{

   try{
     const checkquery = `SELECT email, password, is_verified, user_id , role FROM user WHERE email = ?`
    const checkresult = await db(checkquery,[email])
    

    if(checkresult.length === 0){
      return {success : false, message : "Account not Found"}
    }
    const user = checkresult[0]
    if(!user.is_verified){
      return { success : false , message : "Account is not Verified yet , Please Verify it first"}
    }

    const isMatch = await bcrypt.compare(password , user.password)
    if(!isMatch){
      return {success : false , message : "Wrong Credentials"}
    }
  
    return  { success : true , message : "Login Successfully" , payload : user}
   }catch(error){
    console.log("Login Error",error)
   }
 
}

exports.GetnotVerified = async (user_id) => {
  try {
    const query = "SELECT is_verified, code_expiry FROM user WHERE user_id = ?";
    const res = await db(query, [user_id]);

    if (res.length === 0) {
      return { success: false, message: "User not found" };
    }

    const user = res[0];
    const now = new Date();

    if (user.is_verified) {
      return { success: false, message: "User is already verified" };
    }

    if (!user.code_expiry || new Date(user.code_expiry) < now) {
      return { success: false, message: "Verification code expired" };
    }

    return { success: true, message: "User is not verified and code is still valid" };
  } catch (err) {
    return { success: false, message: "Internal server error" };
  }
};


