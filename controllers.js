const { Message, sendMesageBodySchema } = require("./schemas");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const sendMessage = async (req, res) => {
  try {
    //validate request body
    const body = req.body;
    const { error } = sendMesageBodySchema.validate(body);

    //handle error in case request body fails validation
    if (error) {
      throw {
        code: 400,
        message: error.details[0].message,
      };
    }
    const { message, otp, ...user } = body;

    //creating new intsance of the message
    const newMessage = new Message({
      message,
      otp,
      user,
    });

    //save message instance in DB if error,throw the error, if no error send the OTP

    //await?
    newMessage.save((error) => {
      throw error;
    });

    res.status(201).json({ status: true, response: newMessage });
  } catch (error) {
    //extract status and message from the error object
    const statusCode = error?.code || 404;
    const errorMessage = error?.message || "Something went wrong";
    res.status(statusCode).json({ status: false, message: errorMessage });
  }
};

module.exports = { sendMessage };
