const express = require('express')
const dotenv = require('dotenv')
const chats = require('./data/data')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const { notFound, erroHandler } = require('./middleware/errorMiddleware')

const app = express()
app.use(express.json()) // to accept express data
dotenv.config()
connectDB()


app.get('/',(req,res)=>{
    res.send("hello i am shivam")
})

app.use('/api/user',userRoutes)
app.use('/api/chat', chatRoutes)

app.use(notFound)
app.use(erroHandler)

const PORT = process.env.PORT || 4001

app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`)
})