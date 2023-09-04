const AWS = require('aws-sdk');
const { CognitoIdentityServiceProvider } = AWS;
const { connectDB } = require('../config/dbConfig');
const User = require('../models/userModel');

require('dotenv').config();

exports.updateUser = async (event) => {
  console.log("Lambda function invoked");

  try {
    console.log("Event:", JSON.stringify(event));

    if (!event.headers || !event.headers.Authorization || !event.headers.Authorization.startsWith("Bearer ")) {
      console.log("Unauthorized request: Missing or invalid Authorization header");
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    const token = event.headers.Authorization.replace("Bearer ", ""); 

    const username = event.requestContext.authorizer.claims.preferred_username;
    console.log("Username:", username);

    const updatedUserData = JSON.parse(event.body);
    console.log("Updated user data:", updatedUserData);

    if (!updatedUserData.name || !updatedUserData.surname) {
      console.log("Bad request: Missing name or surname");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Name and surname are required fields" }),
      };
    }

    await connectDB();
    console.log("Connected to the database");

    const mongoResponse = await User.updateOne({ username }, {
      name: updatedUserData.name,
      surname: updatedUserData.surname,
      username: updatedUserData.username,
    });
    console.log("MongoDB response:", mongoResponse);

    console.log("User updated successfully in MongoDB");

    const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
    const cognitoResponse = await cognitoIdentityServiceProvider.adminUpdateUserAttributes({
      UserPoolId: process.env.USER_POOL_ID,
      Username: username,
      UserAttributes: [
        {
          Name: 'given_name',
          Value: updatedUserData.name,
        },
        {
          Name: 'family_name',
          Value: updatedUserData.surname,
        },
        {
          Name: 'preferred_username',
          Value: updatedUserData.username,
        },
      ],
    }).promise();
    console.log("Cognito response:", cognitoResponse);

    console.log("User updated successfully in Cognito");

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "User updated successfully" }),
    };
  } catch (error) {
    console.error("An error occurred", error);
    
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.message || "An error occurred" }),
    };
  }
};

