import compareHashPassword from "../middleware/passwordCompare.js";
import { convertPasswordToHash } from "../middleware/passwordHashing.js";
import adminSModel from "../models/adminModel.js";


const handleCreateNewSuperior = async(req,res) => {
    try{
        const requestedValues = req.body;
        const {password, ...values} = requestedValues;
        // console.log("requestedValues",password);
        console.log("requestedValues",values);
        const passwordConversion = await convertPasswordToHash(password);
        const mergeObject = {password: passwordConversion, ...values};
        // console.log("mergeObject",mergeObject);
        const newRegistration = await adminSModel.create(mergeObject)
        res.send({data: newRegistration})
    } catch(err){
        console.log("err",err);
        res.send({data: err})
    }   
}

// listing of admin and subadmin

const handleListingAdminSubAdmin = async(req,res) => {
    try{
        const allAuthorizedUsers = await adminSModel.find({});
        // console.log(allAuthorizedUsers);
        res.status(200).send({message: "Data Fetch successfully", data: allAuthorizedUsers})
    }
    catch(err){
        res.send({message: "Something went wrong"})
    }
}


// handle admin and subadmin login

const handleAuthorizedLoginSystem = async(req,res) => {
    try{
        const credentialsGot = req.body;
        const findCredentialsDB = await adminSModel.findOne({email: credentialsGot.email});
        console.log("findCredentialsDB",findCredentialsDB)
        switch(true){
            case findCredentialsDB == null:
                res.status(404).send({message: "user not found"});
                break;
            case findCredentialsDB != null:
                const passwordResult = await compareHashPassword(credentialsGot.password , findCredentialsDB.password);
                // console.log(passwordResult, "comparedpasswordResult");
                if(passwordResult == true){
                    const {password, ...restValues} = findCredentialsDB;
                    res.status(200).send({message: "User Logged In Successfully", data: restValues})
                }
                else{
                    res.status(200).send({message: "Password not matched"})
                }
                break;
        }
    }
    catch(err){

    }
}

export {handleCreateNewSuperior , handleListingAdminSubAdmin, handleAuthorizedLoginSystem}