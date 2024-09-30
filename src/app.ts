import express from 'express'
import db from "../db/db"
import fs from 'fs';
import userRouter from "./routes/user"
import https from 'https';
import taskRouter from "./routes/task"
import onboardRouter from "./routes/onboard"
import { Request,Response } from 'express'
import path from 'path'
import cors from 'cors'


const port = process.env.PORT || 8080
const app = express()

const options = {
  key: fs.readFileSync(path.resolve(__dirname, '../server.key')), 
  cert: fs.readFileSync(path.resolve(__dirname, '../server.cert')), 
};


// app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json())
app.use('/uploads/', express.static('uploads'));
app.use('/users', userRouter)
app.use('/tasks',taskRouter)
app.use('/onboard',onboardRouter)

app.get('/',(req:Request,res:Response)=>{
res.send('App is running and uploads should run now!')
})

https.createServer(options, app).listen(port, async () => {
  try {
    await db.select();
    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.log(error);
  }
});


