const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 2200;
// const socketIO = require("socket.io");
// const http = require('http');
const app = express();
const colors = require("colors");

const connectDB = require("./config/db")
// var server = require('http').Server(app);


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
// app.use(notFound);
// app.use(errorHandler);
// const allowedOrigins = ['https://real-deal-exchange-web.vercel.app', ':https://admin-panel-real-deal-exchange.vercel.app'];

// app.use(
//   cors({
//     origin: allowedOrigins,
//     origin: true,
//   })
// );






const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const authRouter = require("./routes/authRoutes");
const postRouter = require("./routes/postRouter");
const userRouter = require("./routes/userRouter");
const groupRouter = require("./routes/groupRouter");
const groupPostRouter = require("./routes/groupPostRouter");
const requestRouter = require("./routes/userRequestRouter");
const AdminRouter = require("./routes/adminRouter");
const AdsRouter = require("./routes/adsRouter");
const NoftifyRouter = require("./routes/NoftifyRouter");


app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);
app.use("/api/groups", groupRouter);
app.use("/api/groupsPost", groupPostRouter);
app.use("/api/requestedUser", requestRouter);
app.use("/api/Admin", AdminRouter);
app.use("/api/tasks", AdsRouter);
app.use("/api/notifications", NoftifyRouter);


app.get('/', async (req, res) => {
  res.json({ message: `server is running at ${PORT}` })
})


connectDB().then(() => {

  app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`.yellow.underline);
  });
})