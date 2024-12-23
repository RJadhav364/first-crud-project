import { jwtKey } from "../config/common.js";
import jwt from "jsonwebtoken"
const verifyJWTToken = async(token) => {
    const result = jwt.verify(token, jwtKey , async(err) => {
        if(err){
            return true
        } else{
            return false
        }
    });
    // console.log("result",await result);
    const response = await result;
    return response;
}

export default verifyJWTToken;