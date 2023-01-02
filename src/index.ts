import express from 'express'
import userRouter from './routes/UserRoutes'
import petRouter from './routes/PetRoutes'
import authRouter from './routes/AuthRoutes'
import fileUpload from 'express-fileupload'
import path from 'path'

const cors = require('cors')


const app = express()

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir: path.resolve(__dirname, '..', 'tmp'),
}))

app.use('/user', userRouter)
app.use('/pet', petRouter)
app.use('/auth', authRouter)

app.listen(3030, ()=>{
    console.log("Servidor rodando! Porta: 3030")
})