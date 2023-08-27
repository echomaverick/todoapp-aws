const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");

module.exports.getAllUsers = async (event) => {
  try {
    await connectDB();
    const users = await User.find({})
      .populate("tasks", "title description")
      .populate("projects", "name description");
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://my-service-todoapp-bucket.s3-website-us-west-2.amazonaws.com",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "http://my-service-todoapp-bucket.s3-website-us-west-2.amazonaws.com",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "An error occurred while retreiving the users from the server",
      }),
    };
  }
};
