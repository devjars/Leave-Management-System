const express = require("express");
const cors = require("cors");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const userRoute = require("./Route/UserRoute");
app.use("/user", userRoute);