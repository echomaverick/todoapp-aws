const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");

module.exports.deleteTask = async (event) => {
  try {
    await connectDB();
    const taskId = event.pathParameters.id;
    const deletedTask = await Tasks.findByIdAndRemove(taskId);

    if (!deletedTask) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Task not found" }),
      };
    }

    await User.updateMany({ tasks: taskId }, { $pull: { tasks: taskId } });

    await Projects.updateMany({ tasks: taskId }, { $pull: { tasks: taskId } });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Task deleted successfully." }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while deleting the task",
      }),
    };
  }
};
