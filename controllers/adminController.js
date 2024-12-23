import compareHashPassword from "../middleware/passwordCompare.js";
import { convertPasswordToHash } from "../middleware/passwordHashing.js";
import verifyJWTToken from "../middleware/verifyToken.js";
import adminSModel from "../models/adminModel.js";


const handleCreateNewSuperior = async(req,res) => {
    try{
        const requestedValues = req.body;
        const {password, ...values} = requestedValues;
        // console.log("requestedValues",password);
        // console.log("requestedValues",values);
        const passwordConversion = await convertPasswordToHash(password);
        const mergeObject = {password: passwordConversion, ...values};
        // console.log("mergeObject",mergeObject);
        const newRegistration = await adminSModel.create(mergeObject)
        res.send({data: newRegistration})
    } catch(err){
        // console.log("err",err);
        res.send({data: err})
    }   
}

// listing of admin and subadmin

const handleListingAdminSubAdmin = async(req,res) => {
    try{
        const headersToken = req.headers['authorization']
        // console.log(headersToken)
        if(headersToken){
            const token  = headersToken.split(" ")[1];
            // console.log(token);
            const tokenResult = await verifyJWTToken(token);
            // console.log("tokenResult",tokenResult);
            switch(true){
                case tokenResult == false:
                    const allAuthorizedUsers = await adminSModel.find({});
                    res.status(200).send({message: "Data Fetch successfully", data: allAuthorizedUsers})
                    break;
                default:
                    res.status(401).send({message: "Token has expired"});
            }
        } else{
            res.status(498).send({message: "Token not found"})
        }
    }
    catch(err){
        // console.log(err)
        res.send({message: "Something went wrong"})
    }
}


// handle admin and subadmin login

const handleAuthorizedLoginSystem = async(req,res) => {
    try{
        const credentialsGot = req.body;
        // console.log("credentialsGot",req.body)
        const findCredentialsDB = await adminSModel.findOne({email: credentialsGot.email});
        // console.log("findCredentialsDB",findCredentialsDB)
        switch(true){
            case findCredentialsDB == null:
                res.status(404).send({message: "user not found"});
                break;
            case findCredentialsDB != null:
                const passwordResult = await compareHashPassword(credentialsGot.password , findCredentialsDB.password);
                if(passwordResult == true){
                    // console.log(passwordResult, "comparedpasswordResult");
                    // const {password, ...restValues} = findCredentialsDB;
                    const payload = {
                        id: findCredentialsDB._id,
                        email: findCredentialsDB.email,
                        role: findCredentialsDB.role,
                        firstname: findCredentialsDB.firstname,
                        hasAllRights: findCredentialsDB.hasAllRights,
                        mnumber: findCredentialsDB.mnumber,
                    };
                    // console.log(payload, "payload");
                    res.status(200).send({message: "User Logged In Successfully", data: {
                        token: await findCredentialsDB.generateToken(payload),
                        id: findCredentialsDB._id,
                        email: findCredentialsDB.email,
                        role: findCredentialsDB.role, // Assuming you store the user's role
                        firstname: findCredentialsDB.firstname, // Custom field if needed
                        hasAllRights: findCredentialsDB.hasAllRights, // Custom field if needed
                        mnumber: findCredentialsDB.mnumber, // Username
                    }})
                }
                else{
                    res.status(401).send({message: "Unauthorized, Password not matched"})
                }
                break;
        }
    }
    catch(err){
        console.log(err)
    }
}

// handle admin and subadmin edit

const handleAuthorizedEdit = async(req,res) => {
    try{
        const requestedObject = req.body;
        // console.log(requestedObject)
        const editedAuthorizeddata = await adminSModel.findOneAndUpdate({_id: req.params.id }, requestedObject);
        // console.log(await adminSModel.findById({_id: req.params.id }))
        res.status(200).send({message: "Data updated successfully" });
    } catch(err){
        res.status(400).send("Something went wrong");
    }
}

// handle id wise admin and subadmin data
const handleAuthorizedparticular = async(req,res) => {
    try{
        const adminId = req.params.id;
        const fetchDataById = await adminSModel.findById({_id: adminId });
        res.status(200).send({message:"data fetched" , data: fetchDataById});
    } catch(err){
        res.status(400).send("Something went wrong");
    }
}

export {handleCreateNewSuperior , handleListingAdminSubAdmin, handleAuthorizedLoginSystem, handleAuthorizedEdit , handleAuthorizedparticular}