const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");

module.exports.getAllTasks = async (event) => {
  try {
    await connectDB();
    const tasks = await Tasks.find({})
      .populate("assignedTo", "name surname username email")
      .populate("projects", "name description");

    function replacer(key, value) {
      if (typeof value === "object" && value !== null && value.constructor) {
        if (value.constructor.name === "MongoClient") {
          return undefined;
        }
      }
      return value;
    }
    const jsonString = JSON.stringify(tasks, replacer);

    return {
      statusCode: 200,
      body: jsonString,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message:
          "An error occurred while retreiving the tasks from the server.",
      }),
    };
  }
};
