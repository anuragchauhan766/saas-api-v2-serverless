import middy from "@middy/core";

import { APIGatewayProxyHandler } from "aws-lambda";

import { connectDB } from "src/config/mongo";

import { jsonResponse } from "src/helper/jsonResponse";
import { bodyValidator } from "src/middleware/validator";
import { IUser, User, createUserBodySchema } from "src/model/user";
import { z } from "zod";

const lambdaHandler: APIGatewayProxyHandler = async (event, context) => {
  // TODO: apply security so that a user can only update its owns info

  try {
    const updateObject: IUser = JSON.parse(event.body as string);
    await connectDB();
    const user = await User.findOneAndUpdate(
      { _id: event.requestContext.authorizer?.claims?.mongoId },
      updateObject,
      {
        new: true,
      }
    );
    return jsonResponse(200, {
      success: true,
      messgae: "User updated successfully",
      data: user,
    });
  } catch (error: any) {
    return jsonResponse(500, {
      success: false,
      message: "Internal server error, Could not update user",
      error: error.message,
    });
  }
};

export const handler = middy(lambdaHandler).use(
  bodyValidator(createUserBodySchema.partial())
);
