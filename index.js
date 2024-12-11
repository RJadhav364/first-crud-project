import express from "express"
import connectionMongoDB from "./connection.js";
import { handleCreateNewSuperior } from "./controllers/adminController.js";

const app = express();
const PORT = 9000;
connectionMongoDB();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use("/admin", handleCreateNewSuperior)
app.listen(PORT, () => {
    console.log(`app is running on PORT ${PORT}`);
})