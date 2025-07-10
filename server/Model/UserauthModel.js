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
      return { success: true, code : code };
    } else {
      return { success: false };
    }
  } catch (error) {
    throw error;
  }
};

exports.Verify = async (email, code) => {
  try {
    const query = `SELECT code, code_expiry, user_id, role , email FROM user WHERE email = ?`;
    const res = await db(query, [email]);

    if (res.length === 0) {
      return { success: false, message: "Email not found" };
    }


    const now = new Date();

    if (res[0].code != code) {
      return { success: false, message: `Invalid verification code ${code} = ${res[0].code}` };
    }

    if (new Date(res[0].code_expiry) < now) {
      return { success: false, message: "Verification code has expired" };
    }

     const updateQuery = `UPDATE user SET is_verified = true, code = NULL, code_expiry = NULL WHERE email = ?`;
    const result = await db(updateQuery, [email]);

    if (result.affectedRows > 0) {
      const credentials = {
           user_id : res[0].user_id,
           email : res[0].email,
           role : res[0].role
        }
      return { success: true, message: "Account verified successfully", payload : credentials};
    } else {
      return { success: false, message: "Failed to update verification status" };
    }

  } catch (error) {
    console.error("Verification error:", error);
    return { success: false, message: "Something went wrong" };
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

    const checkquery = `SELECT email,password FROM user WHERE email = ?`
    const checkresult = await db(checkquery,[email])
    if(checkresult.length > 0){
        const isMatch = await bcrypt.compare(password, checkresult[0].password) 
        if(isMatch){
            return { success : true , message : "Login Succesfully"}
        }else{
            return { success : false , message : "Invalid credentials!"}
        }
    }else{
        return { success: false, message : "Account not Found   "}
    }
}
