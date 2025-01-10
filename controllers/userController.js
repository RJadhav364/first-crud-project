import { convertPasswordToHash } from "../middleware/passwordHashing.js";
import verifyJWTToken from "../middleware/verifyToken.js";
import adminSModel from "../models/adminModel.js";
import userSModel from "../models/userModel.js";

const handleCreateNewUser = async(req,res) => {
    try{
        const headersToken = req.headers['authorization']
        if(headersToken){
            const token  = headersToken.split(" ")[1];
            // console.log(token);
            const tokenResult = await verifyJWTToken(token);
            // console.log("tokenResult",tokenResult);
                // console.log("inside if");
                const {password, ...values} = req.body;
                const passwordConversion = await convertPasswordToHash(password);
                const mergeObject = {password: passwordConversion, ...values};
                // console.log("mergeObject",mergeObject);
                const newRegistration = await userSModel.create(mergeObject)
                res.status(200).send({message: "New user created"})
        } else{
            res.status(498).send({message: "Token not found"})
        }
        console.log(req.body);
        // const {password, ...values} = req.body;
        // const passwordConversion = await convertPasswordToHash(password);
        // const mergeObject = {password: passwordConversion, ...values};
        // const newRegistration = await userSModel.create(mergeObject)
        // res.status(200).send({message: "User Created Successfully"})
    }catch(err){
        console.log(err)
        switch(true){
            case err.errorResponse && err.errorResponse.keyPattern.email == 1:
                // console.log("err",err.errorResponse.errmsg);
                res.status(409).send({message: "Email ID already exist"})
                break;
            default:
                res.send({message: "Something went wrong"})
            
        }
    }
}

const handleGetUsers = async(req,res) => {
    try{
        const headersToken = req.headers['authorization'];
        if(headersToken){
            const token  = headersToken.split(" ")[1];
            // console.log(token);
            const tokenResult = await verifyJWTToken(token);
            console.log(tokenResult.decode.role)
            // switch(true){
            //     case tokenResult.decode.role == "subadmin":
            //         // console.log("subadmin found");

            //         break;
            //     default:
                    switch(true){
                        case tokenResult.result == "false":
                            let passedData;
                            let newRegistration = await userSModel.find({});
                            // console.log(passedData)
                            let adminModeldata = await adminSModel.find({});
                            passedData = await newRegistration.map(({_id,firstname,lastname,email,role,number,handledSubAdmin}) => ({
                                id: _id,
                                firstname,
                                lastname,
                                email,
                                role,
                                number,
                                handledSubAdmin,
                                authorizedDetails: adminModeldata.find(value => value._id.equals(handledSubAdmin))
                            }))
                            // console.log(passedData)
                            res.status(200).send({message:"Data fetched successfully", data: passedData})
                            break;
                        default:
                            res.status(401).send({message: "Token has expired"});
                    }
            // }
        } else{
            res.status(498).send({message: "Token not found"})
        }
    } catch(err){
        console.log(err)
        switch(true){
            case err.name == "TokenExpiredError":
                res.status(401).send({message: "Token has expired"})
                break;
            default:
                res.send({message: "An unexpected error occurred. Please try again later."})
        }
    }
}

export {handleCreateNewUser,handleGetUsers}