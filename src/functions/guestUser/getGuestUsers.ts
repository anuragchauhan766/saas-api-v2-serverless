import middy from "@middy/core";
import { APIGatewayProxyHandler } from "aws-lambda";

import { connectDB } from "src/config/mongo";
import { handleDuplicateKeyError } from "src/helper/handleDuplicateKeyError";
import { jsonResponse } from "src/helper/jsonResponse";
import { zodMongoObjectId } from "src/helper/zodObjectIdTypes";
import { bodyValidator } from "src/middleware/validator";
import {
  GuestUser,
  IGuestUser,
  createGuestUserSchema,
} from "src/model/guestUser";
import { ZodError } from "zod";

const lambdaHandler: APIGatewayProxyHandler = async (event, context) => {
  try {
    const projectId = zodMongoObjectId("projectId").parse(
      event.pathParameters?.projectId
    );

    await connectDB();

    const guestUser = await GuestUser.find({
      projectId,
    });
    return jsonResponse(200, {
      success: true,
      data: guestUser,
    });
  } catch (error: any) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      return handleDuplicateKeyError(error.message);
    }
    if (error instanceof ZodError) {
      return jsonResponse(400, {
        success: false,
        name: "Bad Request",
        message: "Invalid query parameters in request URL",
      });
    }
    return jsonResponse(500, {
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const handler = lambdaHandler;
