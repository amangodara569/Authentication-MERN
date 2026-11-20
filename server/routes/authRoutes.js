import express from "express";
import { register, login, logout, isAuthenticated } from "../controllers/authController.js";
import findUserIDFromToken from "../middlewares/userAuth.js"; //importing the middleware to find userID from token
const authRouter = express.Router(); //what is this
//add this router in server .js file
authRouter.post("/register", register); //when this route is called, register logic will be used
authRouter.post("/login", login);
authRouter.post("/logout", logout);

authRouter.post("/send-verify-otp", findUserIDFromToken, sendVerifyOTP); //this route will be used to send otp to user email, we are using the middleware to find userID from token
authRouter.post("/verify-account", findUserIDFromToken, verifyUserWithOTP); //this route will be used to verify user with otp
authRouter.post("is-Auth", findUserIDFromToken, isAuthenticated); //this route will be used to check if user is authenticated or not, we are using the middleware to find userID from token
export default authRouter;

