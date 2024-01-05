import { APIGatewayProxyHandler } from "aws-lambda";
import { connectDB } from "src/config/mongo";
import { jsonResponse, unauthorizedResponse } from "src/helper/jsonResponse";
import { zodMongoObjectId } from "src/helper/zodObjectIdTypes";
import { Collaborator, createCollaboratorSchema } from "src/model/collaborator";
import { ZodError } from "zod";

const lambdaHandler: APIGatewayProxyHandler = async (event, context) => {
  try {
    const userId = zodMongoObjectId("userId").parse(
      event.pathParameters?.userId
    );

    const projectId = zodMongoObjectId("projectId").parse(
      event.pathParameters?.projectId
    );
    const collaboratorData = createCollaboratorSchema
      .pick({
        email: true,
      })
      .parse({ email: event.pathParameters?.email });
    if (event.requestContext.authorizer?.claims.mongoId !== userId) {
      return unauthorizedResponse();
    }
    await connectDB();
    await Collaborator.deleteOne({
      projectId: projectId,
      email: collaboratorData.email,
    });

    return jsonResponse(200, {
      success: true,
      message: "Collaborator deleted successfully",
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
