import { pool } from "../../config/db"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const loginUser = async(email:string,password:string) =>{
    const result = await pool.query(`SELECT * FROM users WHERE email=$1 RETURNING *`,[email]);
    if(result.rows.length === 0){
        return null
    }
    const user = result.rows[0];
    const isMatch = bcrypt.compare(password,user.hashedPass);
    if(!isMatch){
        return false
    }
    const secret ="KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"
    const token =jwt.sign({name:user.name,email:user.email},secret,{expiresIn:"8d"});
    console.log(token)
    return {user,token}
}

export const authService ={
    loginUser
}