const { Message, sendMesageBodySchema } = require("./schemas");
const twilio = require("twilio");
const { throwErrorObject } = require("./utils/helpers");

const sendMessage = async (req, res) => {
  try {
    //validate request body
    const body = req.body;
    const { error } = sendMesageBodySchema.validate(body);

    //throw error in case, request body fails validation
    if (error) {
      throw throwErrorObject(400, error.details[0].message);
    }

    const { message, otp, ...user } = body;
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    //send message to recepient
    const response = await twilio(accountSid, authToken).messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: user?.mobile?.toString(),
    });

    //throw error if, fails to send message
    if (response?.errorCode || response?.errorMessage) {
      throw throwErrorObject(response?.error_code, response?.errorMessage);
    }

    //creating new intsance of the message and save it to DB
    const newMessage = new Message({
      message,
      otp,
      user,
    });
    await newMessage.save();

    res.status(201).json({ status: true, response });
  } catch (error) {
    //extract status and message from the error object
    const statusCode = error?.code || 404;
    const errorMessage = error?.message || "Something went wrong";
    res.status(statusCode).json({ status: false, message: errorMessage });
  }
};

module.exports = { sendMessage };
