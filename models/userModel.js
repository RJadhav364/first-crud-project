import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    signUpUserid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "signUpCollection",
    },
    firstname: {
        type: String,
        required: true, 
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    userType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    // assign: {
    //     type: String,
    //     required: true,
        
    // },
});

const userSModel = mongoose.model('userModule', userSchema);

export default userSModel;