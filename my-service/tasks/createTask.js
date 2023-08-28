const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");

module.exports.createTask = async (event) => {
  try {
    await connectDB();
    // let removeByteOrderMark = (a) => (a[0] === "\ufeff" ? a.slice(1) : a);
    // const data = JSON.parse(removeByteOrderMark(event.body));
    const data = event.body;
    const { title, description, assignedTo, projects, dueDate } = JSON.parse(data);
    console.log("Event body", event.body);

    if (!title || !description || !assignedTo) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin":
            "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          message: "Title, description and assignedTo are required fields",
        }),
      };
    }

    if (!dueDate || new Date(dueDate) < new Date()) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin":
            "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          message: "The date of the task should not be in the past",
        }),
      };
    }

    const titleRegex = /^[A-Za-z\s]+$/;
    if (!titleRegex.test(title)) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin":
            "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          message:
            "Invalid title format! Title should only contain letters and spaces",
        }),
      };
    }

    const descriptionRegex = /^[A-Za-z\s]+$/;
    if (!descriptionRegex.test(description)) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin":
            "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          message:
            "Invalid description format! Description should only contain letter and spaces",
        }),
      };
    }

    const existingUser = await User.findById(assignedTo);
    if (!existingUser) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin":
            "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          message: "Invalid user ID! User does not exists.",
        }),
      };
    }

    const newTask = new Tasks({
      title,
      description,
      assignedTo,
      projects,
      duDate: new Date(dueDate),
    });
    await newTask.save();

    await User.updateMany(
      { _id: { $in: assignedTo } },
      { $push: { tasks: newTask._id } }
    );

    await Projects.updateMany(
      { _id: { $in: projects } },
      { $push: { tasks: newTask._id } }
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin":
          "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(newTask),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin":
          "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "An error occurred while creating the task",
      }),
    };
  }
};
