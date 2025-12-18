import createHttpError from "http-errors";

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (createHttpError.isHttpError(err)) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  res.status(500).json({
    message: "Internal Server Error",
  });
};
