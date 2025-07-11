const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.createUser = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const code = Math.floor(100000 + Math.random() * 900000).toString(); 
  const expiry = new Date(Date.now() + 10 * 60 * 1000); 

  const query = `INSERT INTO user (email, password, code, code_expiry) VALUES (?, ?, ?, ?)`;

  try {
    const res = await db(query, [email, hashedPassword, code, expiry]);
    if (res.affectedRows > 0) {
      return { success: true,
               message : 'User created successfully. Please check your email for the verification code.' , 
               code : code };
    } else {
      return { success: false };
    }
  }catch (error) {
  console.error("CreateUser error:", error);
  return { success: false, message: "Internal server error" };
}
};

exports.Verify = async (email, code) => {
  
  try{
    const checkquery = `SELECT user_id ,email , code , code_expiry  is_verified , role FROM user WHERE email = ? `
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
        const   {user_id , email:dbemail , role:dbrole} = user
        const credential = {
          id : user_id,
          email : dbemail,
          role : dbrole
        }
        return { success : true , message : "Sign up Successfully", payload :credential }
      }else{
        return { success : false , message : "Code Verification Failed! Please try Again !"}
      }
    

  }catch(error){
    console.log("Error Verifying the code",error.message) 
    return { success : false, message : "Internal server error"}
  }
};

exports.ResendCode = async (email) => {
  try {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    const query = `UPDATE user SET code = ?, code_expiry = ? WHERE email = ?`;
    const res = await db(query, [newCode, expiry, email]);

    if (res.affectedRows > 0) {
      return { success: true, code: newCode };
    } else {
      return { success: false, message: "Email not found or update failed" };
    }
  } catch (error) {
    console.error("ResendCode error:", error);
    return { success: false, message: "Something went wrong" };
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
     const   {user_id , email:dbemail , role:dbrole} = user
        const credential = {
          id : user_id,
          email : dbemail,
          role : dbrole
        }
    return  { success : true , message : "Login Successfully" , payload : credential}
   }catch(error){
    console.log("Login Error",error)
    return { success : false , message : "Internal Server Error"}
   }
 
}
