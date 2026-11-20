import express from "express";
import { getUserData } from "../controllers/userController.js";
import findUserIDFromToken from "../middlewares/userAuth.js"; //importing the middleware to find userID from token
const userRouter = express.Router();

userRouter.get("/data", findUserIDFromToken, getUserData); //this route will be used to get user data, we are using the middleware to find userID from token

export default userRouter;
