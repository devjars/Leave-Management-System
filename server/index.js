const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser')

require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  methods : ['POST','GET','UPDATE'],
  origin : ['http://localhost:5173'],
  credentials : true
}))

app.use(express.json())
app.use(cookieParser())
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const userRoute = require("./Route/UserRoute");
app.use("/user", userRoute);