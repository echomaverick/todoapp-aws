const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports.deleteUser = async (event) => {
  try {
    await connectDB();
    const userId = event.pathParameters.id;
    const deletedUser = await User.findByIdAndRemove(userId);

    if (!deletedUser) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    await Tasks.updateMany(
      { assignedTo: userId },
      { $pull: { assignedTo: userId } }
    );

    await Projects.updateMany({ users: userId }, { $pull: { users: userId } });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://my-service-todoapp-bucket.s3-website-us-west-2.amazonaws.com",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "User deleted successfully." }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while deleting the user",
      }),
    };
  }
};
