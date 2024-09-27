import express from 'express'
import bodyParser from 'body-parser'
import db from "../db/db"
import userRouter from "./routes/user"
import taskRouter from "./routes/task"
import onboardRouter from "./routes/onboard"
import { Request,Response } from 'express'
import fs from 'fs';
import path from 'path';


const port = process.env.PORT || 8080
const app = express()

const uploads = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploads)) {
    fs.mkdirSync(uploads, { recursive: true });
    console.log(`'uploads' directory created at ${uploads}`);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(bodyParser.json())
app.use('/uploads/', express.static('uploads'));
app.use('/users', userRouter)
app.use('/tasks',taskRouter)
app.use('/onboard',onboardRouter)

app.get('/',(req:Request,res:Response)=>{
res.send('App is running and uploads should run now!')
})

app.listen(port,async() => {
  try {
    await db.select();
    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.log(error); 
  }
})


