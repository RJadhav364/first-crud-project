import { convertPasswordToHash } from "../middleware/passwordHashing.js";
import verifyJWTToken from "../middleware/verifyToken.js";
import adminSModel from "../models/adminModel.js";
import userSModel from "../models/userModel.js";

const handleCreateNewUser = async(req,res) => {
    const findCredentialsUserDB = await adminSModel.findOne({email: req.body.email});
    try{
        if(findCredentialsUserDB == null){
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
        } else{
            res.status(400).send({message: "You are already an authorized person. You cannot create a user account."})
        }
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
        let page = Number(req.query.page) || 1;
        let limit = 10;
        let skip = (page - 1) * limit;
        console.log(skip)
        const headersToken = req.headers['authorization'];
        if(headersToken){
            const token  = headersToken.split(" ")[1];
            // console.log(token);
            const tokenResult = await verifyJWTToken(token);
            console.log(tokenResult.decode)
            let newRegistration 
            let adminModeldata = await adminSModel.find({});
            // let allAuthorizedUsersCoun2t = await userSModel.countDocuments();
            // console.log(allAuthorizedUsersCoun2t);
            let passedData;
            let allUsersCount;
            let totaPages;
            switch(true){
                case tokenResult.decode.role == "subadmin":
                    // console.log("subadmin found",newRegistration);
                    newRegistration = await userSModel.find({handledSubAdmin: tokenResult.decode.id}).skip(skip).limit(limit);
                    const subadminWiseData = await newRegistration.filter(({handledSubAdmin}) => handledSubAdmin == tokenResult.decode.id);
                    passedData = await subadminWiseData.map(({_id,firstname,lastname,email,role,number,handledSubAdmin}) => ({
                        id: _id,
                        firstname,
                        lastname,
                        email,
                        role,
                        number,
                        handledSubAdmin,
                        authorizedDetails: adminModeldata.find(value => value._id.equals(handledSubAdmin))
                    }))
                    allUsersCount = await userSModel.countDocuments({handledSubAdmin: tokenResult.decode.id});
                    totaPages = Math.ceil(allUsersCount / limit)
                    res.status(200).send({message:"Data fetched successfully", data: passedData,total_records: allUsersCount , total_page: totaPages , current_page:page})
                    break;
                default:
                    newRegistration = await userSModel.find({}).skip(skip).limit(limit);
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
                    allUsersCount = await userSModel.countDocuments();
                    totaPages = Math.ceil(allUsersCount / limit)
                    res.status(200).send({message:"Data fetched successfully", data: passedData,total_records: allUsersCount , total_page: totaPages , current_page:page, skipDataCount: skip})
                    //         break;
                    //     default:
                    //         res.status(401).send({message: "Token has expired"});
                    // }
            }
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

const handleGetParticularUsers = async(req,res) => {
    try{
        const userId = req.params.id;
        const fetchDataById = await userSModel.findById({_id: userId });
        // console.log(fetchDataById)
        let passObject = {
            id: fetchDataById._id,
            firstname: fetchDataById.firstname,
            lastname: fetchDataById.lastname,
            email: fetchDataById.email,
            role: fetchDataById.role,
            handledSubAdmin: fetchDataById.handledSubAdmin,
            number: fetchDataById.number,
        }
        let adminDetails = await adminSModel.findById({_id: passObject.handledSubAdmin});
        // console.log(adminDetails);
        if(adminDetails != null){
            adminDetails = {
                id: adminDetails._id,
                firstname: adminDetails.firstname,
                email: adminDetails.email,
                role: adminDetails.role,
                hasAllRights: adminDetails.hasAllRights,
                mnumber: adminDetails.mnumber,
            }
            passObject = {adminDetails, ...passObject}
            res.status(200).send({message:"data fetched" , data: passObject});
        } else{
            passObject = {adminDetails, ...passObject}
            res.status(200).send({message:"data fetched" , data: passObject});
        }
    } catch(err){
        // console.log(err)
        res.status(400).send("Something went wrong");
    }
}

const handleUpdateUser = async(req,res) => {
    try{
        const requestedObject = req.body;
        const headersToken = req.headers['authorization']
        // console.log(requestedObject.body)
        if(headersToken){
            const token  = headersToken.split(" ")[1];
            // console.log(token);
            const tokenResult = await verifyJWTToken(token);
            // console.log("tokenResult",tokenResult);
            if(tokenResult.decode.role == "admin" || (tokenResult.decode.role == "subadmin" && requestedObject.hasAllRights == "Yes")){
                // console.log("inside if");
                const editedAuthorizeddata = await userSModel.findOneAndUpdate({_id: req.params.id }, requestedObject.body);
                // console.log(await adminSModel.findById({_id: req.params.id }))
                res.status(200).send({message: "Data updated successfully" });
            } else{
                res.status(403).send({message: "You do not have permission to perform this action"})
            }
        } else{
            res.status(498).send({message: "Token not found"})
        }
    } catch(err){
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

const handleDeleteUser = async(req,res) => {
    try{
        const requestedObject = req.body;
        const headersToken = req.headers['authorization']
        // console.log(requestedObject)
        
        if(headersToken){
            const token  = headersToken.split(" ")[1];
            // console.log(token);
            const tokenResult = await verifyJWTToken(token);
            // console.log("tokenResult",tokenResult);
            if(tokenResult.decode.role == "admin"){
                // console.log("inside if");
                const deleteAuthorizedId = await userSModel.findOneAndDelete({_id: req.params.id });
                // console.log(await adminSModel.findById({_id: req.params.id }))
                res.status(200).send({message: "Data deleted successfully" });
            } else{
                res.status(403).send({message: "You do not have permission to perform this action"})
            }
        } else{
            res.status(498).send({message: "Token not found"})
        }
    }catch(err){
        switch(true){
            case err.name == "TokenExpiredError":
                res.status(401).send({message: "Token has expired"})
                break;
            default:
                res.status(403).send({message: "An unexpected error occurred. Please try again later."})
        }
    }
}

export {handleCreateNewUser,handleGetUsers,handleGetParticularUsers,handleUpdateUser,handleDeleteUser}