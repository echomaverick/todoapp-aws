const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");
const mongoose = require("mongoose");

module.exports.updateProject = async (event) => {
  try {
    await connectDB();
    const projectId = event.pathParameters.id;
    const { name, description, users, tasks, dueDate, completed } = JSON.parse(
      event.body
    );

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
        body: JSON.stringify({ error: "Project ID does not exists" }),
      };
    }

    if (!name || !description || !users || !tasks) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "All field are required (name, description, users, projects)",
        }),
      };
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Invalid name format! Name should only contain alphanumeric characters and spaces.",
        }),
      };
    }

    const descriptionRegex = /^[A-Za-z\s]+$/;
    if (!descriptionRegex.test(description)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Invalid description format! Description should only contain alphanumeric characters and spaces.",
        }),
      };
    }

    if (
      !Array.isArray(users) ||
      !users.every((usersId) => mongoose.Types.ObjectId.isValid(usersId))
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Invalid 'users' field. It should be an array of valid ObjectId.",
        }),
      };
    }

    project.name = name;
    project.description = description;
    project.users = users;
    project.tasks = tasks;
    project.completed = completed;

    if (dueDate && new Date(dueDate) >= new Date()) {
      project.dueDate = new Date(dueDate);
    }

    const updatedProject = await project.save();

    return {
      statusCode: 200,
      body: JSON.stringify(updatedProject),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while updating the project",
      }),
    };
  }
};
