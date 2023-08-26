const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");

module.exports.getAllProjects = async (event) => {
  try {
    await connectDB();
    const projects = await Projects.find({})
      .populate("users", "name surname username email")
      .populate("tasks", "title description")
      .exec();

    return {
      statusCode: 200,
      body: JSON.stringify(projects),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error while retreiving the projects from the server.",
      }),
    };
  }
};
