import authModel from "../models/auth.js";
import { sendError } from "../utils/response/sendError.js";
import { sendSuccess } from "../utils/response/sendSuccess.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const emailExist = await authModel.findOne({ email });
    if (emailExist) {
      return sendError(res, 409, "Email already exist, choose another one.");
    }

    const data = await authModel.create({
      name,
      email,
      password,
    });

    if (data) {
      return sendSuccess(res, 201, "Signup Successfully", data);
    }
  } catch (error) {
    console.log(error);
    return sendError(res, 500, "Internal Server Error");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await authModel.findOne({ email });
    if (!data) {
      return sendError(res, 401, "Inavlid User!");
    }
    const passwordExist = await data.comparedPassword(password);
    if (!passwordExist) {
      return sendError(res, 401, "Invalid User!");
    }

    const token = await data.generateToken();

    return sendSuccess(res, 200, "Login Successfully", data, token);
  } catch (error) {
    console.log(error);
    return sendError(res, 500, "Internal Server Error");
  }
};
