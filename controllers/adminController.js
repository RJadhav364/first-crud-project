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

export {handleCreateNewSuperior}