// process.env.NODE_ENV = 'development';
const AppError = require("./../Utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

// Handle duplicate fields error
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value:${value}.Please use another value`;

  return new AppError(message, 400);
};

// Handle min or max value error
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((element) => element.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// Handle json invalid token through headers
const handleJWTError = () =>
  new AppError("Invalid token! Please login again.", 401);

// Handle expired token
const handleExpiredJWTTokenError = () =>
  new AppError("Your token has expired! Please login again.", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    ststus: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted errors:Send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      // ststus: err.status,
      message: err.message,
    });

    // Programming or other unknown errors:Dont leak error detail to client
  } else {
    // 1) Log error
    console.error("ERROR😥", err);
    // 2) send generic message
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  console.log("Error is", err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // console.log("Node Env",process.env.NODE_ENV)
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
    // sendErrorProd(err, res)
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    // console.log("error name", err);
    if (err.name === "CastError") {
      /* console.log("cast error") */ 
      error = handleCastErrorDB(err);
    }

    // Handle duplicate fields error
    if (err.code === 11000) {
      error = handleDuplicateFieldsDB(err);
    }

    // Handle min or max value error
    if (err.name === "ValidationError") {
      error = handleValidationErrorDB(err);
    }

    // Handle json invalid token through headers
    if (err.name === "JsonWebTokenError") {
      error = handleJWTError();
    }

    // Handle expired token
    if (err.name === "TokenExpiredError") {
      error = handleExpiredJWTTokenError();
    }

    sendErrorProd(error, res);
    // sendErrorprod(error, res)
  }
};
