const morgan = require("morgan");
const express = require("express");
const appError = require("./Utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const bookRouter = require("./routers/bookRouters");
const chapterRouter = require("./routers/chapterRouters");
const pageRouter = require("./routers/pageRouters");
const viewRouter = require("./routers/viewRouters");
const userRouter = require("./routers/userRouters");
const purchasingRouter = require("./routers/purchasingRouters");
const app = express();

// GLOBAL Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


app.use(express.json());

// app.use(express.static(`${__dirname}/public`))
app.use(express.static("./public"));

app.use((req, res, next) => {
  // console.log('Middleware');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  // console.log(req.cookies);
  next();
});

// Routers
app.use('/',viewRouter)
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/chapters", chapterRouter);
app.use("/api/v1/pages", pageRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/purchasing", purchasingRouter);

app.all("*", (req, res, next) => {
  next(new appError(`Cant't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
console.log(app.get("env"));

module.exports = app;
