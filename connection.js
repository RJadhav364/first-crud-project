import mongoose from "mongoose";

const connectionMongoDB = async() => {
    return mongoose.connect("mongodb://127.0.0.1:27017/mytesting")
    .then(() => console.log("database connected"))
    .catch((err) => {
        console.log("error while connecting database", err);
    })
}

export default connectionMongoDB