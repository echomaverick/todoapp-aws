// handler.js
const mongoose = require('mongoose');
const connectDB = require('../config/dbConfig');
const User = require('../models/userModel');
const Task = require('../models/taskModel');
const Projects = require('../models/projectModel');
const Roles = require('../models/roleModel');

module.exports.getTasksForUserByUsername = async (event) => {
  try {
    await connectDB();
    const username = event.pathParameters.username;
    const user = await User.findOne({ username });
    if (!user) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    const tasks = await Task.find({ assignedTo: user._id })
      .populate('assignedTo', 'name surname username email')
      .populate('projects', 'name description');
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(tasks),
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
      body: JSON.stringify({ error: 'An error occurred' }),
    };
  }
};
