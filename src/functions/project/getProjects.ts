import { APIGatewayProxyHandler } from "aws-lambda";
import { connectDB } from "src/config/mongo";
import { jsonResponse, unauthorizedResponse } from "src/helper/jsonResponse";
import { zodMongoObjectId } from "src/helper/zodObjectIdTypes";
import { IProject, Project, createProjectBodySchema } from "src/model/project";
import { ZodError } from "zod";
import project from ".";

const lambdaHandler: APIGatewayProxyHandler = async (event, context) => {
  try {
    const userId = zodMongoObjectId("userId").parse(
      event.pathParameters?.userId
    );

    // check if user accessing its own data or not
    // TODO: admin should access others data
    if (event.requestContext.authorizer?.claims.mongoId !== userId) {
      return unauthorizedResponse();
    }
    let query: Partial<IProject> = { ownerId: userId };
    if (event.queryStringParameters) {
      const queryParams = createProjectBodySchema

        .partial({
          name: true,
          ownerId: true,
        })
        .parse(event.queryStringParameters);

      query = {
        ...queryParams,
        ...query,
      };
    }

    connectDB();
    const projects = await Project.find(query);

    return jsonResponse(200, {
      success: true,
      data: projects,
    });
  } catch (error: any) {
    console.log(error);
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
