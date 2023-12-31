import { APIGatewayProxyHandler } from "aws-lambda";
import { jsonResponse } from "src/helper/jsonResponse";
import { getAuth } from "firebase-admin/auth";
import { initializeFirebaseSdk } from "src/config/firebase";
import { connectDB } from "src/config/mongo";
import { User } from "src/model/user";
import middy from "@middy/core";
import { Query } from "mongoose";

const lambdaHandler: APIGatewayProxyHandler = async (event, context) => {
  // TODO: apply security so that a user can only get its owns info
  try {
    if (!event.queryStringParameters) {
      return jsonResponse(400, {
        success: false,
        messgae:
          "Please provide the required Query parameter , either 'email' or 'id'",
      });
    }
    const { email, id } = event.queryStringParameters;
    if (!(email || id)) {
      return jsonResponse(400, {
        success: false,
        messgae:
          "Please provide valid query parameter, accepted parameter are 'email' or 'id'",
      });
    }
    const query = id ? { _id: id } : { email };

    await connectDB();
    const users = await User.findOne(query);
    if (!users) {
      return jsonResponse(404, {
        success: false,
        messgae: "user not found with the given parameter",
      });
    }
    return jsonResponse(200, {
      success: true,
      messgae: "user data is listed below",
      users,
    });
  } catch (error) {
    return jsonResponse(500, {
      success: false,
      messgae: "Internal server error",
      error,
    });
  }
};
export const handler = middy(lambdaHandler);
