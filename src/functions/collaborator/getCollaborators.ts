import { APIGatewayProxyHandler } from "aws-lambda";
import { error } from "console";
import { connectDB } from "src/config/mongo";
import { jsonResponse, unauthorizedResponse } from "src/helper/jsonResponse";
import { zodMongoObjectId } from "src/helper/zodObjectIdTypes";
import { Collaborator } from "src/model/collaborator";
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
    const collaborator = await Collaborator.find({
      projectId: projectId,
    });

    return jsonResponse(200, {
      success: true,
      data: collaborator,
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
      message: "Internal server error",
      error: error,
    });
  }
};

export const handler = lambdaHandler;
