import mongoose from "mongoose";

export const db = () => {
  const uri = process.env.MONGODB_URL;
  const data = mongoose
    .connect(uri)
    .then(() => console.log("DB connected successfully."))
    .catch((error) => console.log(error));
  return data;
};
