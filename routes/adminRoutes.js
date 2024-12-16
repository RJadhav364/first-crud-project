import express from "express"
import { handleAuthorizedEdit, handleAuthorizedLoginSystem, handleAuthorizedparticular, handleCreateNewSuperior, handleListingAdminSubAdmin } from "../controllers/adminController.js"

const adminController = express.Router();

adminController.post("/new-rolecontroller", handleCreateNewSuperior);
adminController.get("/admin-users", handleListingAdminSubAdmin);
adminController.post("/userlogin", handleAuthorizedLoginSystem);
adminController.put("/admin-edit/:id", handleAuthorizedEdit);
adminController.get("/admin-users/:id", handleAuthorizedparticular);

export default adminController