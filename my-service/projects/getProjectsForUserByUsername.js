const Task = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Roles = require("../models/roleModel");
const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");

module.exports.getProjectsForUserByUsername = async (event) => {
  try {
    await connectDB();
    const username = event.pathParameters.username;
    const user = await User.findOne({ username });
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    const projects = await Projects.find({ users: user._id })
      .populate("users", "name surname username email")
      .populate("tasks", "name description");
    return {
      statusCode: 200,
      body: JSON.stringify(projects),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while retreiving the projects for the user",
      }),
    };
  }
};
