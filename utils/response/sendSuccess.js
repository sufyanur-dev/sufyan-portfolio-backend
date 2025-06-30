export const sendSuccess = (res, status, msg, payload, token) => {
  const data = {
    success: true,
    message: msg,
  };

  if (payload) data.payload = payload;
  if (token) data.token = token;
  res.status(status).json({ data });
};
