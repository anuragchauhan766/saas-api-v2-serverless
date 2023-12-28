import middy from "@middy/core";
import { APIGatewayProxyHandler } from "aws-lambda";
import { connectDB } from "src/config/mongo";
import { jsonResponse, unauthorizedResponse } from "src/helper/jsonResponse";
import { zodMongoObjectId } from "src/helper/zodObjectIdTypes";
import { bodyValidator } from "src/middleware/validator";
import { IProject, Project, createProjectBodySchema } from "src/model/project";
import { ZodError } from "zod";

const lambdaHandler: APIGatewayProxyHandler = async (event, context) => {
  try {
    const userId = zodMongoObjectId("userId").parse(
      event.pathParameters?.userId
    );

    const projectId = zodMongoObjectId("projectId").parse(
      event.pathParameters?.projectId
    );

    const updateObject: IProject = JSON.parse(event.body as string);

    // check if user accessing its own data or not
    // TODO: admin should access others data
    if (event.requestContext.authorizer?.claims.mongoId !== userId) {
      return unauthorizedResponse();
    }

    await connectDB();
    const project = await Project.findOneAndUpdate(
      { _id: projectId },
      updateObject,
      { new: true }
    );
    return jsonResponse(200, {
      success: true,
      data: project,
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

export const handler = middy(lambdaHandler).use(
  bodyValidator(createProjectBodySchema.partial())
);
