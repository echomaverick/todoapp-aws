const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports.updateUser = async (event) => {
  console.log("Lambda function invoked");
  try {
    await connectDB();
    console.log("Connected to the database");
    console.log("Event:", JSON.stringify(event));
    const userId = event.pathParameters.id;
    console.log("User ID:", userId);

    const data = event.body;
    const { name, surname, username, email, role, tasks, projects } =
      JSON.parse(data);

    if (!name || !surname || !username || !email || !role || !tasks) {
      console.log(
        "Fields are all required name, surname, username, email, role, tasks, projects"
      );
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": true,
        },
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
    if (!surnameRegex.test(name)) {
      console.log("Invalid surname format");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Invalid surname format! Surname should only contain letters and spaces.",
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

    const existingUsername = await User.findOne({ username });
    if (existingUsername && existingUsername._id.toString() !== userId) {
      console.log("Username already exists");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Username already exists! Try a different one.",
        }),
      };
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log("Email already exists");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Email already exists! Try a different one or try to login to your account.",
        }),
      };
    }

    const existingRole = await Role.findById(role);
    if (!existingRole) {
      console.log("Role does not exists");
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "Invalid role ID! Role does not exists.",
        }),
      };
    }

    const existingTasks = await Tasks.find({ _id: { $in: tasks } });
    if (existingTasks.length !== tasks.length) {
      console.log("Task does not exists");
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "Invalid task ID! Task does not exists",
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
        role,
        tasks,
        projects,
      },
      { new: true }
    )
      .populate("tasks", "title description")
      .populate("projects", "name description");

    if (!updatedUser) {
      console.log("User is not found");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    console.log("use updated successfully");

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(updatedUser),
    };
  } catch (error) {
    console.log("An error happened", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred." }),
    };
  }
};
