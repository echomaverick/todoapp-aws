// const jwt = require("jsonwebtoken");

// module.exports.refreshAccessToken = async (event) => {
//   console.log("Lambda function invoked");

//   try {
//     const refreshToken =
//       event.headers.Cookie &&
//       event.header.Cookie.split(";")
//         .find((c) => c.trim().startsWith("refreshToken"))
//         .split("=")[1];

//     if (!refreshToken) {
//       console.log("Refresh token not found");
//       return {
//         statusCode: 404,
//         body: JSON.stringify({ error: "Refresh token not found " }),
//       };
//     }

//     jwt.verify(
//       refreshToken,
//       "45911196651d13fa71e4d86ea7d27d1a583e538433778b6f13b0c440373384557c94fce113b45415250adbcfccdce6546295e6e64d4991db5330c9ffbca1c535",
//       (error, decoded) => {
//         if (error) {
//           console.log("Invalid refresh token", error);
//           return {
//             statusCode: 404,
//             body: JSON.stringify({ error: "Invalid refresh token" }),
//           };
//         }

//         const newAccessToken = jwt.sign(
//           { userId: decoded.userId },
//           "8de6645ac47b4a3a99cc1a16b778fbd42c0626bd21b3fd8398120584f59854aa2e1eafc94e64c6274cdbd057372ed7f93ba904b194974f0a8f14d0835c4fd0bd",
//           { expiresIn: "1h" }
//         );

//         console.log("Access token refreshed");
//         return {
//           statusCode: 200,
//           body: JSON.stringify({ token: newAccessToken }),
//         };
//       }
//     );
//   } catch (error) {
//     console.log("An error happened", error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: "An error occurred" }),
//     };
//   }
// };
