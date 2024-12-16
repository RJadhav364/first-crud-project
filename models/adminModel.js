import mongoose from "mongoose";

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    firstname: {
        type: String,
        required: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    hasAllRights: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mnumber: {
        type: String,
        required: true
    }
});

adminSchema.path('hasAllRights')
    .default("No")

const adminSModel = mongoose.model('operationAdmin', adminSchema);

export default adminSModel;