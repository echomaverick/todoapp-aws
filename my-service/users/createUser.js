// const connectDB = require("../config/dbConfig");
// const User = require("../models/userModel");
// const Tasks = require("../models/taskModel");
// const Projects = require("../models/projectModel");
// const Role = require("../models/roleModel");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");

// module.exports.createUser = async (event) => {
//   console.log("Lambda function invoked");

//   try {
//     await connectDB();
//     console.log("Conneted to the database");

//     const data = JSON.parse(event.body);

//     const { name, surname, username, email, password, role } = data;
//     console.log("Received data: ", data);

    // if (!name || !surname || !username || !email || !password || !role) {
    //   console.log("All fields are required");
    //   return {
    //     statusCode: 404,
    //     body: JSON.stringify({ error: "All fields are required" }),
    //   };
    // }

    // const nameRegex = /^[A-Za-z\s]+$/;
    // if (!nameRegex.test(name)) {
    //   console.log("Invalid name format");
    //   return {
    //     statusCode: 404,
    //     body: JSON.stringify({
    //       error:
    //         "Invalid name format! Name should only contain letters and spaces.",
    //     }),
    //   };
    // }

    // const surnameRegex = /^[A-Za-z\s]+$/;
    // if (!surnameRegex.test(surname)) {
    //   console.log("Invalid surname format");
    //   return {
    //     statusCode: 404,
    //     body: JSON.stringify({
    //       error:
    //         "Invalid surname format! Surname should only letters and spaces.",
    //     }),
    //   };
    // }

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   console.log("Invalid email format");
    //   return {
    //     statusCode: 404,
    //     body: JSON.stringify({ error: "Invalid email format!" }),
    //   };
    // }

    // const passwordRegex =
    //   /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    // if (!passwordRegex.test(password)) {
    //   console.log("Invalid password format");
    //   return {
    //     statusCode: 404,
    //     body: JSON.stringify({
    //       error:
    //         "Invalid password format! Password must be at least 8 characters long and should contain at least one number, one letter and one symbol.",
    //     }),
    //   };
    // }

    // const existingUsername = await User.findOne({ username });
    // if (existingUsername) {
    //   console.log("Username already exists");
    //   return {
    //     statusCode: 404,
    //     body: JSON.stringify({
    //       message: "Username already exists! Try a different one.",
    //     }),
    //   };
    // }

    // const existingEmail = await User.findOne({ email });
    // if (existingEmail) {
    //   console.log("Email already exists");
    //   return {
    //     statusCode: 404,
    //     body: JSON.stringify({
    //       error:
    //         "Email already exists! Try a different one or try to login to your account.",
    //     }),
    //   };
    // }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       name,
//       surname,
//       username,
//       email,
//       password: hashedPassword,
//       role,
//     });
//     const savedUser = await newUser.save();

//     const token = jwt.sign(
//       { userId: savedUser._id, username: savedUser.username, password: savedUser.password },
//       "20157d0fac56d307ed14b3b85f03f0cd9368c79ad832b662c431c02749a3641a137f9eb724e922df84553a09cc42fd6ad9330e19b899ded87cf9348aec16eb41",
//       { expiresIn: "1h" }
//     );

//     console.log("User created successfully");
//     return {
//       statusCode: 200,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
//         "Access-Control-Allow-Headers": "Content-Type, Authorization",
//         "Access-Control-Allow-Credentials": true,
//       },
//       body: JSON.stringify({ user: savedUser, token: `Bearer ${token}` }),
//     };

//   } catch (error) {
//     console.log("An error happened", error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: "An error occurred." }),
//     };
//   }
// };


const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'us-west-2',
  params: {
    UserPoolId: "us-west-2_tXvx728pX"
  }
});

module.exports.createUser = async (event) => {
  console.log("Lambda function invoked");

  try {
    const data = JSON.parse(event.body);
    console.log("Received data", data);

    const { name, surname, username, email, password, role } = data;

    if (!name || !surname || !username || !email || !password || !role) {
      console.log("All fields are required");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "All fields are required" }),
      };
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      console.log("Invalid name format");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Invalid name format! Name should only contain letters and spaces.",
        }),
      };
    }

    const surnameRegex = /^[A-Za-z\s]+$/;
    if (!surnameRegex.test(surname)) {
      console.log("Invalid surname format");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Invalid surname format! Surname should only letters and spaces.",
        }),
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid email format!" }),
      };
    }

    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      console.log("Invalid password format");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Invalid password format! Password must be at least 8 characters long and should contain at least one number, one letter and one symbol.",
        }),
      };
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.log("Username already exists");
      return {
        statusCode: 409,
        body: JSON.stringify({
          message: "Username already exists! Try a different one.",
        }),
      };
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log("Email already exists");
      return {
        statusCode: 409,
        body: JSON.stringify({
          error:
            "Email already exists! Try a different one or try to login to your account.",
        }),
      };
    }

    const params = {
      ClientId: '30qpp3s8qr32ielb83cupocdkc',
      Username: username,
      Password: password,
      UserAttributes: [
        {
          Name: "given_name",
          Value: name,
        },
        {
          Name: "family_name",
          Value: surname,
        },
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "preferred_username",
          Value: username,
        },
        {
          Name: "custom:role",
          Value: role.toString(),
        },
      ],
    };
    
    const signUpResponse = await cognito.signUp(params).promise();

    const loginPath = "/login";
    return {
      statusCode: 200,
      headers: {
        Location: loginPath,
      },
    };
  } catch (error) {
    console.log("An error happened", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "An error occurred while registering the user",
      }),
    };
  }
};
