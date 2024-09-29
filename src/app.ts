import express from 'express'
import db from "../db/db"
import userRouter from "./routes/user"
import taskRouter from "./routes/task"
import onboardRouter from "./routes/onboard"
import { Request,Response } from 'express'
import cors from 'cors'

const port = process.env.PORT || 8080
const app = express()

// app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allow cookies or auth headers
}))
app.use(express.json())
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


