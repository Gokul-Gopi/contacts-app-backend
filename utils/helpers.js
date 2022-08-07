const throwErrorObject = (code, message) => {
  return { status_code: code, message };
};

module.exports = { throwErrorObject };
