function errorMiddleware(error, req, res, next) {
  if (res.headersSent) return next(error);

  let status = error.status || error.statusCode || 500;
  let message = status >= 500 ? "An unexpected server error occurred." : error.message;

  if (error.name === "ValidationError") {
    status = 400;
    message = Object.values(error.errors).map((item) => item.message).join(" ");
  } else if (error.name === "CastError") {
    status = 400;
    message = "The request contains an invalid identifier or value.";
  } else if (error.code === 11000) {
    status = 409;
    message = "A record with these details already exists.";
  } else if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    status = 400;
    message = "Request body must contain valid JSON.";
  } else if (!Number.isInteger(status) || status < 400 || status > 599) {
    status = 500;
    message = "An unexpected server error occurred.";
  }

  if (status >= 500) {
    console.error(error);
  }

  return res.status(status).json({ success: false, message });
}

module.exports = errorMiddleware;
