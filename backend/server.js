const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const connectDb = require("./config/db");
var bodyParser = require("body-parser");
const { errorHandler } = require("./middleware/errorMiddleWare");
const cors = require("cors");

connectDb();
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use("/courses", require("./routes/courseRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use(express.urlencoded({ extended: false }));
app.use(errorHandler);
app.listen(port, () => console.log(`Server running on port: ${port}`));
