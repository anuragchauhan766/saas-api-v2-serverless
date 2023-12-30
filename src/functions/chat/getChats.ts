import { APIGatewayProxyHandler } from "aws-lambda";
import { connectDB } from "src/config/mongo";
import { jsonResponse } from "src/helper/jsonResponse";
import { zodMongoObjectId } from "src/helper/zodObjectIdTypes";
import { Chat } from "src/model/chat";
import { ZodError } from "zod";

const lambdaHandler: APIGatewayProxyHandler = async (event, context) => {
  try {
    const conversationId = zodMongoObjectId("conversationId").parse(
      event.queryStringParameters?.conversationId
    );

    await connectDB();
    const chats = await Chat.find({ conversationId }).sort({ createdAt: 1 });

    return jsonResponse(200, {
      success: true,
      data: chats,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return jsonResponse(400, {
        success: false,
        name: "Bad Request",
        message:
          "Invalid query parameters in request URL, Please Provide Conversation Id",
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
