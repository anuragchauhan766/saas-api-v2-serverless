import { APIGatewayProxyHandler } from "aws-lambda";

import { connectDB } from "src/config/mongo";
import { jsonResponse, unauthorizedResponse } from "src/helper/jsonResponse";
import { zodMongoObjectId } from "src/helper/zodObjectIdTypes";
import { Interviewee } from "src/model/interviewee";
import { IProject, Project } from "src/model/project";
import { ZodError } from "zod";

const lambdaHandler: APIGatewayProxyHandler = async (event, context) => {
  try {
    const userId = zodMongoObjectId("userId").parse(
      event.pathParameters?.userId
    );

    const intervieweeId = zodMongoObjectId("intervieweeId").parse(
      event.pathParameters?.intervieweeId
    );

    // check if user accessing its own data or not
    if (event.requestContext.authorizer?.claims.mongoId !== userId) {
      return unauthorizedResponse();
    }

    await connectDB();
    await Interviewee.deleteOne({ _id: intervieweeId });
    return jsonResponse(200, {
      success: true,
      message: "Interviewee with id " + intervieweeId + " deleted successfully",
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
