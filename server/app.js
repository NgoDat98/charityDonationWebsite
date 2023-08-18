const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("morgan");
const db = require("./config/db");
const multer = require("multer");
const firebase = require("firebase/app");
const session = require("express-session");

// const usersRouter = require("./routes/users");
// const kbtonthatRouter = require("./routes/kbtonthat");
const usersRouter = require("./routes/users");
const authsRouter = require("./routes/auth");
const campaignRouter = require("./routes/campaign");
const donationRouter = require("./routes/donation");

var app = express();

const firebaseConfig = {
  apiKey: "AIzaSyA-zO_-dBaCIW8e7c48_JzBtnytCRkHMyM",
  authDomain: "quytraitimnhanai.firebaseapp.com",
  projectId: "quytraitimnhanai",
  storageBucket: "quytraitimnhanai.appspot.com",
  messagingSenderId: "327376218670",
  appId: "1:327376218670:web:75b63977fce8a4f60d4dbf",
  measurementId: "G-K12N7W8VQ5",
};

firebase.initializeApp(firebaseConfig);

const upload = multer({ storage: multer.memoryStorage() });

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "PUT", "OPTIONS", "HEAD"],
    credentials: true,
  })
);
db();

app.set("trust proxy", 1);
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.post("/upload", upload.any(), (req, res, next) => {
  const day = new Date();
  res.json({
    status: "success",
    name: `${
      day.getDate() +
      "-" +
      (day.getMonth() + 1) +
      "-" +
      day.getFullYear() +
      "-" +
      day.getHours() +
      "-" +
      day.getMinutes() +
      "-" +
      req.files[0].originalname
    }`,
    multer: req.files[0],
  });
});

app.use("/user", usersRouter);
app.use(authsRouter);
app.use("/campaign", campaignRouter);
app.use("/donation", donationRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
