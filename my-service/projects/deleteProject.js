const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");

module.exports.deleteProject = async (event) => {
  try {
    await connectDB();
    const projectId = event.pathParameters.id;
    const deletedProject = await Projects.findByIdAndRemove(projectId);

    if (!deletedProject) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Project not found" }),
      };
    }

    await User.updateMany(
      { projects: projectId },
      { $pull: { projects: projectId } }
    );

    await Tasks.updateMany(
      { projects: projectId },
      { $pull: { projects: projectId } }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Project deleted successfully" }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while deleting the project",
      }),
    };
  }
};
