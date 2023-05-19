const express = require("express");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");
const uploadRouter = require("./routes/upload");
const app = express();
const PORT = 5000;
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

// データベース接続
mongoose.set('strictQuery', true);
mongoose
.connect(process.env.MONGOURL)
.then(() => {
    console.log("DBと接続中....");
}).catch((err) => {
    console.log(err);
});

//ミドルウェアの設定
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/upload", uploadRouter);

app.get("/", (req, res) => {
    res.send("hello express");
});

app.listen(PORT, () => console.log("サーバが起動しました。"));