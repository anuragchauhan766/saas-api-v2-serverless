import { APIGatewayProxyHandler } from "aws-lambda";
import { connectDB } from "src/config/mongo";
import { jsonResponse, unauthorizedResponse } from "src/helper/jsonResponse";
import { zodMongoObjectId } from "src/helper/zodObjectIdTypes";

import { Conversation } from "src/model/conversation";

import { ZodError } from "zod";

const lambdaHandler: APIGatewayProxyHandler = async (event, context) => {
  try {
    const userId = zodMongoObjectId("userId").parse(
      event.pathParameters?.userId
    );
    const projectId = zodMongoObjectId("projectId").parse(
      event.pathParameters?.projectId
    );
    if (event.requestContext.authorizer?.claims.mongoId !== userId) {
      return unauthorizedResponse();
    }
    await connectDB();
    const conversation = await Conversation.find({
      projectId,
      senderId: userId,
    }).sort({ createdAt: -1 });

    return jsonResponse(200, {
      success: true,
      data: conversation,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return jsonResponse(400, {
        success: false,
        name: "Bad Request",
        message: "Invalid query parameters in request URL",
      });
    }
    return jsonResponse(500, {
      success: false,
      name: "Internal Server Error",
      message: error.message,
    });
  }
};

export const handler = lambdaHandler;
