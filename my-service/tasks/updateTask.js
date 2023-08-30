const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");
const mongoose = require("mongoose");

module.exports.updateTask = async (event) => {
  console.log("Lambda function invoked");

  try {
    await connectDB();
    console.log("Connected to the database");

    console.log(JSON.stringify(event));
    const taskId = event.pathParameters.id;
    console.log("Task ID", taskId);

    const { title, description, assignedTo, projects, completed, dueDate } =
      JSON.parse(event.body);
    console.log("Request data", event.body);

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      console.log("Task id is not correct");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Invalid task ID" }),
      };
    }

    const task = await Tasks.findById(taskId);
    if (!task) {
      console.log("Task might be deleted");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Task ID does not exist" }),
      };
    }

    if (!title || !description || !projects || !assignedTo) {
      console.log("All fields are required");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "All fields are required (title, description, projects, assignedTo)",
        }),
      };
    }

    const titleRegex = /^[A-Za-z\s]+$/;
    if (!titleRegex.test(title)) {
      console.log("Invalid title format");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Invalid title format! Title should only contain alphanumeric characters and spaces.",
        }),
      };
    }

    const descriptionRegex = /^[A-Za-z\s]+$/;
    if (!descriptionRegex.test(description)) {
      console.log("Invalid description format");
      return {
        statusCode: 400,
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
      console.log("Invalid 'assignedTo' field:", assignedTo);
      return {
        statusCode: 400,
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
    console.log("Task updated successfully");

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(updatedTask),
    };
  } catch (error) {
    console.log("An error happened", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update task" }),
    };
  }
};
