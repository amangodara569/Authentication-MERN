import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from './config/mongodb.js'
import authRouter from './routes/authRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}));


app.get('/', (req, res) =>{
    res.send("api working");
})
//api endpoints
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter); //main path is here and login
//to see if these path work go to postman , write http://localhost:4000/api/auth/login and test them , make sure db is working

try {
    await connectDB()

    app.listen(port, ()=>{
        console.log(`Server listening on port ${port}`)
    })
} catch (error) {
    console.error(`Server startup failed: ${error.message}`)
    process.exitCode = 1
}
