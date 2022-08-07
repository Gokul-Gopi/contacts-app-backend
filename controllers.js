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

    if (!message.includes(otp)) {
      //checks if the otp is in the message or not
      throw throwErrorObject(
        400,
        "OTP seems missing! Refresh to regenerate OTP"
      );
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    //send message to recepient
    const response = await twilio(accountSid, authToken).messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: user?.mobile,
    });

    //throw error if, fails to send message
    if (response?.errorCode || response?.errorMessage) {
      throw throwErrorObject(response?.errorCode, response?.errorMessage);
    }

    //creating new intsance of the message and save it to DB
    const newMessage = new Message({
      message,
      otp,
      user,
    });
    await newMessage.save();

    res.status(201).json({ status: true, data: response });
  } catch (error) {
    //extract status and message from the error object
    const statusCode = error?.status_code || 404;
    const errorMessage = error?.message || "Something went wrong";
    res.status(statusCode).json({ status: false, message: errorMessage });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ date: "descending" });
    if (!messages) {
      throw throwErrorObject(404, "No messages found");
    }
    res.status(200).json({ status: true, data: messages });
  } catch (error) {
    //extract status and message from the error object
    const statusCode = error?.status_code || 404;
    const errorMessage = error?.message || "Something went wrong";
    res.status(statusCode).json({ status: false, message: errorMessage });
  }
};

module.exports = { sendMessage, getMessages };
