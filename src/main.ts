import express from 'express';
import dotenv from 'dotenv'
import { router } from "./routers/appeal.routers";
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express'

dotenv.config()
const app = express();
const port = process.env.PORT || 5000;
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'work-with-appeals-service',
            version: '1.0.0',
            description: 'API documentations',
        },
        servers: [ { url: process.env.SERVER_URL } ],
    },
    apis: ['./src/routers/appeal.routers.ts']
}
const swaggerDocs = swaggerJsDoc(swaggerOptions)

app.use(express.json())
app.use('', router)
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));


app.listen(port, () => { 
    console.log(`App listen ${port}`)
})