import express from "express"
import connectionMongoDB from "./connection.js";
import { handleCreateNewSuperior, handleListingAdminSubAdmin } from "./controllers/adminController.js";
import adminController from "./routes/adminRoutes.js";

const app = express();
const PORT = 9000;
connectionMongoDB();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use("/admin", adminController)
app.listen(PORT, () => {
    console.log(`app is running on PORT ${PORT}`);
})