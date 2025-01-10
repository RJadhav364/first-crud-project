import express from "express"
import { handleCreateNewUser, handleGetUsers } from "../controllers/userController.js"

const userController = express.Router();

userController.post("/users-create", handleCreateNewUser);
userController.get("/get-role-users", handleGetUsers);

export default userController