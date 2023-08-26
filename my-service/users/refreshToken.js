const jwt = require("jsonwebtoken");

module.exports.refreshAccessToken = async (event) => {
  try {
    const refreshToken =
      event.headers.Cookie &&
      event.headers.Cookie.split(";")
        .find((c) => c.trim().startsWith("refreshToken="))
        .split("=")[1];
    if (!refreshToken) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Refresh token not found" }),
      };
    }
    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET_KEY,
      (error, decoded) => {
        if (error) {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: "Invalid refresh token" }),
          };
        }
        const newAccessToken = jwt.sign(
          { userId: decoded.userId },
          process.env.SECRET_KEY,
          { expiresIn: "5h" }
        );
        return {
          statusCode: 200,
          body: JSON.stringify({ token: newAccessToken }),
        };
      }
    );
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred" }),
    };
  }
};
