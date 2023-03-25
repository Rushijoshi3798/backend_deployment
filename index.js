const express = require("express");
const app = express();
const { connection } = require("./db");
const { userRouter } = require("./routes/user.routes");
const { noteRouter } = require("./routes/notes.routes");
const { auth } = require("./middleware/auth.middleware");
const cors = require("cors");
require("dotenv").config()
app.use(express.json());
app.use(cors());

app.get("/", (req,res) => {
  res.send({msg: "HOME PAGE"})
})
app.use("/users", userRouter);
app.use("/notes", noteRouter);
app.use("/auth", auth);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
    console.log("Cannot connect to DB");
  }
  console.log("server is running at 4500");
});
