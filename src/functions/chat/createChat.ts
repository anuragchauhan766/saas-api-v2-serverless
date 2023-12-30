import middy from "@middy/core";
import { APIGatewayProxyHandler } from "aws-lambda";
import { connectDB } from "src/config/mongo";
import { jsonResponse } from "src/helper/jsonResponse";
import { zodMongoObjectId } from "src/helper/zodObjectIdTypes";
import { bodyValidator } from "src/middleware/validator";
import { Chat, createChatSchema } from "src/model/chat";
import { Conversation, createConversationSchema } from "src/model/conversation";
import { ZodError, z } from "zod";

const createChatBodySchema = createChatSchema.merge(
  createConversationSchema.pick({ senderId: true, senderType: true })
);

type createChatBodySchemaType = z.infer<typeof createChatBodySchema>;

const lambdaHanler: APIGatewayProxyHandler = async (event, context) => {
  try {
    const chatbody: createChatBodySchemaType = JSON.parse(event.body as string);
    const projectId = zodMongoObjectId("projectId").parse(
      event.pathParameters?.projectId
    );
    await connectDB();
    let conversationId = chatbody.conversationId;

    if (!conversationId) {
      const conversation = await Conversation.create({
        projectId: projectId,
        senderId: chatbody.senderId,
        senderType: chatbody.senderType,
        firstchat: {
          message: chatbody.message,
          response: chatbody.response,
        },
      });
      conversationId = conversation._id;
    }
    const chat = await Chat.create({
      conversationId: conversationId,
      message: chatbody.message,
      response: chatbody.response,
    });
    return jsonResponse(201, {
      success: true,
      message: "Chat created successfully",
      data: chat,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return jsonResponse(400, {
        success: false,
        name: "Bad Request",
        message: "Invalid query parameters in request URL",
      });
    }
    return jsonResponse(500, {
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const handler = middy(lambdaHanler).use(
  bodyValidator(createChatBodySchema)
);
