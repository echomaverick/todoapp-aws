const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");
const mongoose = require('mongoose');

module.exports.updateTask = async (event) => {
  try {
    await connectDB();
    const taskId = event.pathParameters.id;
    const { title, description, assignedTo, projects, completed, dueDate } =
      JSON.parse(event.body);

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ error: "Invalid task ID" }),
      };
    }

    const task = await Tasks.findById(taskId);
    if (!task) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ error: "Task ID does not exist" }),
      };
    }

    if (!title || !description || !projects || !assignedTo) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          error:
            "All fields are required (title, description, projects, assignedTo)",
        }),
      };
    }

    const titleRegex = /^[A-Za-z\s]+$/;
    if (!titleRegex.test(title)) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          error:
            "Invalid title format! Title should only contain alphanumeric characters and spaces.",
        }),
      };
    }

    const descriptionRegex = /^[A-Za-z\s]+$/;
    if (!descriptionRegex.test(description)) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          error:
            "Invalid description format! Description should only contain alphanumeric characters and spaces.",
        }),
      };
    }

    if (
      !Array.isArray(assignedTo) ||
      !assignedTo.every((assignedToId) =>
        mongoose.Types.ObjectId.isValid(assignedToId)
      )
    ) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          error:
            "Invalid 'assignedTo' field. It should be an array of valid ObjectId.",
        }),
      };
    }

    task.title = title;
    task.description = description;
    task.projects = projects;
    task.assignedTo = assignedTo;
    task.completed = completed;

    if (dueDate && new Date(dueDate) >= new Date()) {
      task.dueDate = new Date(dueDate);
    }

    const updatedTask = await task.save();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(updatedTask),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ error: "Failed to update task" }),
    };
  }
};
