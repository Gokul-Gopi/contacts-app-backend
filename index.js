const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectToMongo = require("./utils/connectToDB");
const { sendMessage } = require("./controllers");
dotenv.config();
connectToMongo();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/message", sendMessage);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.ENVIRONMENT} mode on port ${5000}...`
  )
);
