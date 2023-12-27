import middy from "@middy/core";

import { APIGatewayProxyHandler } from "aws-lambda";

import { connectDB } from "src/config/mongo";

import { jsonResponse } from "src/helper/jsonResponse";

import { User } from "src/model/user";

const lambdaHandler: APIGatewayProxyHandler = async (event, context) => {
  // TODO: apply security so that a user can only delete its owns info

  try {
    await connectDB();
    await User.deleteOne({
      _id: event.requestContext.authorizer?.claims?.mongoId,
    });
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
