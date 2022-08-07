const Message = require("./schemas/messageSchema");

const sendMessage = async (req, res) => {
  try {
  } catch (error) {
    const errorMessage = error?.message || "Something went wrong";
    res.status(404).json({ status: false, message: errorMessage });
  }
};
