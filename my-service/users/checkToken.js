const jwt = require("jsonwebtoken");

module.exports.checkToken = async (event, context, callback) => {
  try {
    const authHeader = event.headers.Authorization;
    if (!authHeader) {
      return callback("Unauthorized");
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "20157d0fac56d307ed14b3b85f03f0cd9368c79ad832b662c431c02749a3641a137f9eb724e922df84553a09cc42fd6ad9330e19b899ded87cf9348aec16eb41", (error, decoded) => {
      if (error) {
        return callback("Unauthorized");
      }
      event.decoded = decoded;
      return callback(null, event);
    });
  } catch (error) {
    console.log(error);
    return callback("Unauthorized");
  }
};
