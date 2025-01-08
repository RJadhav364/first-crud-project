import { jwtKey } from "../config/common.js";
import jwt from "jsonwebtoken"
const verifyJWTToken = async(token) => {
    // const result = jwt.verify(token, jwtKey , async(err) => {
    //     if(err){
    //         return true
    //     } else{
    //         // console.log(result);
    //         // console.log("result", result);
    //         // return false
    //     }
    // });
    // console.log("result",result);
    // const response = await result;
    // return response;
    const result = jwt.verify(token, jwtKey);
    // console.log(result)
    const response = {result: "false", decode: result}
    return response;
}

export default verifyJWTToken;