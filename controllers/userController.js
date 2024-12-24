import { convertPasswordToHash } from "../middleware/passwordHashing.js";
import verifyJWTToken from "../middleware/verifyToken.js";
import userSModel from "../models/userModel.js";

const handleCreateNewUser = async(req,res) => {
    try{
        // console.log(req.body);
        const {password, ...values} = req.body;
        const passwordConversion = await convertPasswordToHash(password);
        const mergeObject = {password: passwordConversion, ...values};
        const newRegistration = await userSModel.create(mergeObject)
        res.status(200).send({message: "User Created Successfully"})
    }catch(err){
        console.log(err)
        res.send({message: "Something went wrong"})
    }
}

const handleGetUsers = async(req,res) => {
    try{
        const headersToken = req.headers['authorization'];
        if(headersToken){
            const token  = headersToken.split(" ")[1];
            // console.log(token);
            const tokenResult = await verifyJWTToken(token);
            console.log(tokenResult)
            switch(true){
                case tokenResult.result == "false":
                    const newRegistration = await userSModel.find({});
                    res.status(200).send({message:"Data fetched successfully", data: newRegistration})
                    break;
                default:
                    res.status(401).send({message: "Token has expired"});
            }
        } else{
            res.status(498).send({message: "Token not found"})
        }
    } catch(err){
        res.status(401).send({message: "Token has expired"});
    }
}

export {handleCreateNewUser,handleGetUsers}