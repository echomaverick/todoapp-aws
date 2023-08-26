const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports.updateUser = async (event) => {
  try {
    await connectDB();
    const userId = event.pathParameters.id;
    const data = JSON.parse(event.body);
    const { name, surname, username, email, password, role, tasks, projects } =
      data;

    if (
      !name ||
      !surname ||
      !username ||
      !email ||
      !password ||
      !role ||
      !tasks
    ) {
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
          error:
            "Invalid name format! Name should only contain letters and spaces.",
        }),
      };
    }

    const surnameRegex = /^[A-Za-z\s]+$/;
    if (!surnameRegex.test(name)) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error:
            "Invalid surname format! Surname should only contain letters and spaces.",
        }),
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Invalid email format!" }),
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
    if (existingUsername && existingUsername._id.toString() !== userId) {
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

    const existingRole = await Role.findById(role);
    if (!existingRole) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Invalid role ID! Role does not exists.",
        }),
      };
    }

    const existingTasks = await Tasks.find({ _id: { $in: tasks } });
    if (existingTasks.length !== tasks.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Invalid task ID! Task does not exists",
        }),
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        surname,
        username,
        email,
        password,
        role,
        tasks,
        projects,
      },
      { new: true }
    )
      .populate("tasks", "title description")
      .populate("projects", "name description");

    if (!updatedUser) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(updatedUser),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "An error occurred." }),
    };
  }
};
