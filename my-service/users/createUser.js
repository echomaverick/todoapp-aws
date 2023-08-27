const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports.createUser = async (event) => {
  try {
    await connectDB();
    const data = JSON.parse(event.body);

    const { name, surname, username, email, password, role } = data;
    if (!name || !surname || !username || !email || !password || !role) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "All fields are required" }),
      };
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message:
            "Invalid name format! Name should only contain letters and spaces.",
        }),
      };
    }

    const surnameRegex = /^[A-Za-z\s]+$/;
    if (!surnameRegex.test(surname)) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message:
            "Invalid surname format! Surname should only letters and spaces.",
        }),
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Invalid email format!" }),
      };
    }

    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message:
            "Invalid password format! Password must be at least 8 characters long and should contain at least one number, one letter and one symbol.",
        }),
      };
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Username already exists! Try a different one.",
        }),
      };
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message:
            "Email already exists! Try a different one or try to login to your account.",
        }),
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      surname,
      username,
      email,
      password: hashedPassword,
      role,
    });
    const savedUser = await newUser.save();

    const token = jwt.sign(
      { userId: savedUser._id },
      "20157d0fac56d307ed14b3b85f03f0cd9368c79ad832b662c431c02749a3641a137f9eb724e922df84553a09cc42fd6ad9330e19b899ded87cf9348aec16eb41",
      { expiresIn: "1h" }
    );
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://my-service-todoapp-bucket.s3-website-us-west-2.amazonaws.com",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ user: savedUser, token: `Bearer ${token}` }),
    };
  } catch (error) {
    console.log("An error happened", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "http://my-service-todoapp-bucket.s3-website-us-west-2.amazonaws.com",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "An error occurred." }),
    };
  }
};
