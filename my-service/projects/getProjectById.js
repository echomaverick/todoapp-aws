const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");

module.exports.getProjectById = async (event) => {
  try {
    const id = event.pathParameters.id;
    await connectDB();
    const project = await Projects.findById(id)
      .populate("users", "name surname username email")
      .populate("tasks", "title description");
    if (!project) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Project not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(project),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while retreiving the project",
      }),
    };
  }
};
