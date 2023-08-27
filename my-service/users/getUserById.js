const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");

module.exports.getUserById = async (event) => {
  try {
    const id = event.pathParameters.id;
    await connectDB();
    const user = await User.findById(id)
      .populate("tasks", "title description")
      .populate("projects", "name description");
    if (!user) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "http://my-service-todoapp-bucket.s3-website-us-west-2.amazonaws.com",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ message: "User not found" }),
      };
    }
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://my-service-todoapp-bucket.s3-website-us-west-2.amazonaws.com",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(user),
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
        message: "An error occurred while retreiving the user",
      }),
    };
  }
};
