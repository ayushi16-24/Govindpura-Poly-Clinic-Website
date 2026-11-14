// Jab koi route exist hi nahi karta
export const notFound = (req, res, next) => {
  const error = new Error(`Route nahi mila: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Saare errors yahan aakar ek jaisa JSON response banate hain
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = "Ye value pehle se exist karti hai";
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expire ho gaya, dobara login karein";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
