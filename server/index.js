const express = require("express");
const friendsRouter = require("./routes/friends.router");
const authRouter = require("./routes/authRouter");
const uploadRouter = require("./routes/upload.router");
const postsRouter = require("./routes/posts.router");
const messagesRouter = require("./routes/messages.router");

const cors = require("cors");
const bcrypt = require("bcryptjs");

const {Router} = require("express");
const router = Router();

const multer = require("multer");
const path = require("path");

const PORT = process.env.PORT || 80;

const app = express();

const corsOptions ={
   origin:'*', 
   credentials:true,           
   optionSuccessStatus:200,
}


// app.use(express.static('./uploads'));
app.use('/static', express.static(__dirname + '/uploads/postFiles'));


app.use(cors(corsOptions)) // Use this after the variable declaration
app.use(express.json());

app.use("/api", friendsRouter);
app.use("/api", authRouter);
app.use("/api", uploadRouter);
app.use("/api", postsRouter);
app.use("/api", messagesRouter);





const start = async () => {
   try {
      app.listen(PORT, () => console.log("ok"))
      
   } catch (e) {
      alert(e)
   }
}

start()













