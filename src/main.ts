import express, { NextFunction,Request, Response } from 'express';
import  HttpError  from 'http-errors';
import dotenv from 'dotenv'
import { router } from "./routes/appeal.routers";

dotenv.config()
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json())
app.use('', router)

app.listen(port, () => { 
    console.log(`App listen ${port}`)
})