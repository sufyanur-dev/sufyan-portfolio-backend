import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// create auth schema;
const authSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// bcrypt password
authSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  } else {
    const saltRound = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, saltRound);
  }
  next();
});

// compared password
authSchema.methods.comparedPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

// generate token
authSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      { id: this._id.toString(), name: this.name, email: this.email },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );
  } catch (error) {
    console.log(error);
  }
};

const authModel = new mongoose.model("authModel", authSchema);
export default authModel;
