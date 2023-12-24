import middy from "@middy/core";

import { APIGatewayProxyHandler } from "aws-lambda";

import { connectDB } from "src/config/mongo";

import { jsonResponse } from "src/helper/jsonResponse";

import { User } from "src/model/user";

const lambdaHandler: APIGatewayProxyHandler = async (event, context) => {
  // TODO: apply security so that a user can only delete its owns info

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
    const filter = id ? { _id: id } : { email };

    await connectDB();
    await User.deleteOne(filter);
    return jsonResponse(200, {
      success: true,
      messgae: "User deleted successfully",
    });
  } catch (error: any) {
    return jsonResponse(500, {
      success: false,
      message: "Internal server error, Could not delete user",
      error: error.message,
    });
  }
};

export const handler = middy(lambdaHandler);
