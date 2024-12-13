import mongoose from "mongoose";

const connectionMongoDB = async() => {
    console.log(process.env.MongoDB_path);
    
    return mongoose.connect("mongodb+srv://new_user_rohan:rohanJadhav@cluster0.no1et41.mongodb.net/mytesting")
    .then(() => console.log("database connected"))
    .catch((err) => {
        console.log("error while connecting database", err);
    })
}


export default connectionMongoDB