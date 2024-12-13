import express from "express"
import connectionMongoDB from "./connection.js";
import { handleCreateNewSuperior, handleListingAdminSubAdmin } from "./controllers/adminController.js";
import adminController from "./routes/adminRoutes.js";
import cors from "cors"
const app = express();
const PORT = 9000;
connectionMongoDB();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
var corsOptions = {
    origin: "*",  // Allow any origin for now (you can restrict this to specific origins later)
    methods: "GET,HEAD,POST,PUT,PATCH,DELETE",  // Allowed methods
    allowedHeaders: "Content-Type,Authorization",  // Allowed headers
    optionsSuccessStatus: 200  // Some legacy browsers choke on 204
};
app.use(cors(corsOptions));
app.use("/admin", adminController)
app.listen(PORT, () => {
    console.log(`app is running on PORT ${PORT}`);
})