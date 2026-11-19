
import express from 'express';
import { register, login, logout } from '../controllers/authController.js' 

const authRouter = express.Router(); //what is this 
//add this router in server .js file
authRouter.post('/register', register); //when this route is called, register logic will be used
authRouter.post('/login', login);
authRouter.post('/logout', logout);

export default authRouter;