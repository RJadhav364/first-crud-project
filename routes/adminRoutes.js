import express from "express"
import { handleAuthorizedLoginSystem, handleCreateNewSuperior, handleListingAdminSubAdmin } from "../controllers/adminController.js"

const adminController = express.Router();

adminController.post("/new-rolecontroller", handleCreateNewSuperior);
adminController.get("/admin-users", handleListingAdminSubAdmin);
adminController.post("/userlogin", handleAuthorizedLoginSystem);

export default adminController