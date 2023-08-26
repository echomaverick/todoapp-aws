const mongoose = require("mongoose");
const connectDB = require("../config/dbConfig");
const Tasks = require("../models/taskModel");

module.exports.markTaskAsCompleted = async (event) => {
  try {
    await connectDB();
    const taskId = event.pathParameters.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Invalid task ID" }),
      };
    }
    const task = await Tasks.findById(taskId);

    if (!task) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Task not found" }),
      };
    }

    task.completed = true;
    task.completedAt = new Date();

    const updatedTask = await task.save();

    return {
      statusCode: 200,
      body: JSON.stringify(updatedTask),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to mark task as completed" }),
    };
  }
};
