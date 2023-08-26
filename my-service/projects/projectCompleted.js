const mongoose = require("mongoose");
const Projects = require("../models/projectModel");
const connectDB = require("../config/dbConfig");

module.exports.projectCompleted = async (event) => {
  try {
    await connectDB();
    const projectId = event.pathParameters.id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Invalid project ID" }),
      };
    }
    const project = await Projects.findById(projectId);

    if (!project) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Project not found" }),
      };
    }

    project.completed = true;
    project.completedAt = new Date();

    const updatedProject = await project.save();

    return {
      statusCode: 200,
      body: JSON.stringify(updatedProject),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to mark project as completed" }),
    };
  }
};
