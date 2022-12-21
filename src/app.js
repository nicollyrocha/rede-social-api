const express = require("express");
const cors = require("cors");
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
// ==> Rotas da API:

const index = require("./routes/index");
const userRoute = require("./routes/user.routes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: "application/vnd.api+json" }));
app.use(cors());
app.use(index);
app.use(cookieParser());
app.use(
  session({
    secret: process.env.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 8 * 60 * 60 * 1000,
    },
  })
);
app.use("/api/", userRoute);
module.exports = app;
