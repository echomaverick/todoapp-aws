const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");

module.exports.getTaskById = async (event) => {
  try {
    const id = event.pathParameters.id;
    await connectDB();
    const task = await Tasks.findById(id)
      .populate("assignedTo", "name surname username email")
      .populate("projects", "name description");
    if (!task) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Task not found" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(task),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred whyle retreiving the task",
      }),
    };
  }
};
