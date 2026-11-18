import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from './config/mongodb.js'

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}));


app.get('/', (req, res) =>{
    res.send("api working");
})

try {
    await connectDB()

    app.listen(port, ()=>{
        console.log(`Server listening on port ${port}`)
    })
} catch (error) {
    console.error(`Server startup failed: ${error.message}`)
    process.exitCode = 1
}
