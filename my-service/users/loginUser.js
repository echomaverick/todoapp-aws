// const connectDB = require("../config/dbConfig");
// const User = require("../models/userModel");
// const Tasks = require("../models/taskModel");
// const Projects = require("../models/projectModel");
// const Role = require("../models/roleModel");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");

// const headersComponent = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
//   "Access-Control-Allow-Credentials": true,
// };

// module.exports.loginUser = async (event) => {
//   console.log("Lambda function invoked");
//   try {
//     await connectDB();
//     console.log("Connected to database");

//     console.log("Event body", event);
//     const data = event.body;
//     const { username, password } = data;

//     if (!username || !password) {
//       console.log("Missing username or password");
//       return {
//         statusCode: 404,
//         body: JSON.stringify({ error: "USername and password are required" }),
//       };
//     }

//     const user = await User.findOne({ username });
//     if (!user) {
//       console.log("User not found");
//       return {
//         statusCode: 404,
//         body: JSON.stringify({ error: "Invalid username" }),
//       };
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       console.log("Invalid password");
//       return {
//         statusCode: 404,
//         body: JSON.stringify({ error: "Invalid password" }),
//       };
//     }

//     const token = jwt.sign(
//       { userId: user._id, username: user.username, role: user.role },
//       "8de6645ac47b4a3a99cc1a16b778fbd42c0626bd21b3fd8398120584f59854aa2e1eafc94e64c6274cdbd057372ed7f93ba904b194974f0a8f14d0835c4fd0bd",
//       {
//         expiresIn: "1h",
//       }
//     );

//     const refreshToken = jwt.sign(
//       { userId: user._id },
//       "45911196651d13fa71e4d86ea7d27d1a583e538433778b6f13b0c440373384557c94fce113b45415250adbcfccdce6546295e6e64d4991db5330c9ffbca1c535",
//       {
//         expiresIn: "100d",
//       }
//     );

//     console.log("Login successful");
//     return {
//       statusCode: 200,
//       headers: headersComponent,
//       body: JSON.stringify(token),
//     };
//   } catch (error) {
//     console.log("An error happened", error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: "An error occurred while logging in" }),
//     };
//   }
// };



const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider();

const headersComponent = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": true,
};

module.exports.loginUser = async (event) => {
  console.log("Lambda function invoked");
  try {
    console.log(JSON.stringify(event));
    
    const requestBody = JSON.parse(event.body);

    console.log("Username from request:", requestBody.username);
    console.log("Password from request:", requestBody.password);

    const authParams = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: "30qpp3s8qr32ielb83cupocdkc",
      AuthParameters: {
        USERNAME: requestBody.username,
        PASSWORD: requestBody.password,
      },
    };
    

    const authResult = await cognito.initiateAuth(authParams).promise();

    console.log("Authentication result", authResult);

    const accessToken = authResult.AuthenticationResult.AccessToken;

    const params = {
      AccessToken: accessToken,
    };

    try {
      const result = await cognito.getUser(params).promise();

      console.log("User information", result);

      return {
        statusCode: 200,
        headers: headersComponent,
        body: JSON.stringify({ message: "Hello, " + result.Username }),
      };
    } catch (authError) {
      console.log("Authentication error", authError);
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid or expired token" }),
      };
    }
  } catch (error) {
    console.log("An error happened", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred while processing the request" }),
    };
  }
};
