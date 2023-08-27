const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports.loginUser = async (event) => {
  try {
    await connectDB();
    const data = JSON.parse(event.body);
    const { username, password } = data;

    if (!username || !password) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ message: "USername and password are required" }),
      };
    }

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
        body: JSON.stringify({ error: "Invalid username" }),
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ error: "Invalid password" }),
      };
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      "20157d0fac56d307ed14b3b85f03f0cd9368c79ad832b662c431c02749a3641a137f9eb724e922df84553a09cc42fd6ad9330e19b899ded87cf9348aec16eb41",
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      {
        userId: user._id,
      },
      "45911196651d13fa71e4d86ea7d27d1a583e538433778b6f13b0c440373384557c94fce113b45415250adbcfccdce6546295e6e64d4991db5330c9ffbca1c535",
      {
        expiresIn: "365d",
      }
    );

    return {
      statusCode: 200,
      headers: {
        "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; Max-Age=${30 * 24 * 60 * 60 * 1000}`,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ token }),
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
      body: JSON.stringify({ error: "An error occurred" }),
    };
  }
};
