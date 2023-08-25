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

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
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

    const token = jwt.sign({ userId: savedUser._id }, "8de6645ac47b4a3a99cc1a16b778fbd42c0626bd21b3fd8398120584f59854aa2e1eafc94e64c6274cdbd057372ed7f93ba904b194974f0a8f14d0835c4fd0bd", { expiresIn: "1h" });
    return {
      statusCode: 200,
      body: JSON.stringify({ user: savedUser, token: `Bearer ${token}` }),
    };
} catch (error) {
    console.log("An error happened", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "An error occurred." }),
    };
  }
};
