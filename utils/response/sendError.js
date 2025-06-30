export const sendError = (res, status, msg) => {
  res.status(status).json({
    success: true,
    message: msg,
  });
};
