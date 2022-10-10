const express = require("express");
const dontenv = require("dotenv");
const cors = require("cors");
var cookieParser = require('cookie-parser');
var  bodyParser = require("body-parser"); 
var logger = require('morgan');
const fileUpload = require('express-fileupload');

const mongoose=require("mongoose");

const sourcefileRouter = require("./routes/sourcefile-routes")

dontenv.config();
const app = express();

//srtup the server port
const port = process.env.PORT || 5000;

//Middlewares
app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(cors());


// Defining CORS
app.use(function (req, res, next) {

  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));


//define the route for "/"
app.get("/", function (request, response) {
    //show this file when the "/" is requested
    response.sendFile(__dirname + "/views/index.html");
});

// define route file
app.use("/api/v1/file", sourcefileRouter);

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => console.log("Connected to MongoDb successfully"))
  .then(() => {
    app.listen(port);
  })
  .then(() => console.log(`App Started on port ${port}`))
  .catch((err) => console.log(err));

app.use;