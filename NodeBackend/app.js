import expresss from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express()

//middlewares 
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true 
}))
app.use(expresss.json())
app.use(cookieParser())


//mongodb connect
const MONGO_URI='mongodb://localhost:27017/auth-system'
async function main(){
    await mongoose.connect(MONGO_URI)
}
main().then(()=>{
    console.log("connected to db")
}).catch((err)=>{
    console.log(err)
})

//routes 
app.use('/auth')
app.use('/posts') // Routes for creating posts, getting user's posts, public accepted posts
app.use('/admin/posts')// Routes for admin review of posts

app.listen(5000,()=>{
    console.log('app is listening on port 5000')
})
