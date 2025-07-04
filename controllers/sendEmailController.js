import { sendEmail } from "../utils/mailer.js";
import { sendSuccess } from "../utils/response/sendSuccess.js";
import { sendError } from "../utils/response/sendError.js";

export const sendEmailController = async (req, res) => {
  try {
    const { name, email, sub, msg } = req.body;

    if ((name && email && sub, msg)) {
      sendEmail({
        to: email,
        subject: sub,
        text: `Details:
            Name: ${name}
            Email: ${email}
            Message: ${msg}`,
      });

      sendSuccess(
        res,
        200,
        "Email has been sent successfully!",
        req.body,
        null
      );
    }
  } catch (error) {
    sendError(res, 500, "Internal Server Error!");
    console.log(error);
  }
};
