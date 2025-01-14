import express from "express"
import { handleCreateNewUser, handleGetParticularUsers, handleGetUsers } from "../controllers/userController.js"

const userController = express.Router();

userController.post("/users-create", handleCreateNewUser);
userController.get("/get-role-users", handleGetUsers);
userController.get("/get-role-users/:id", handleGetParticularUsers);

export default userController