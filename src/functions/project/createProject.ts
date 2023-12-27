import middy from "@middy/core";
import { APIGatewayProxyHandler } from "aws-lambda";
import { Types } from "mongoose";
import { connectDB } from "src/config/mongo";
import { handleDuplicateKeyError } from "src/helper/handleDuplicateKeyError";
import { jsonResponse, unauthorizedResponse } from "src/helper/jsonResponse";
import { bodyValidator } from "src/middleware/validator";
import { IProject, Project, createProjectBodySchema } from "src/model/project";

const lambdaHandler: APIGatewayProxyHandler = async (event, context) => {
  try {
    const projectData: IProject = JSON.parse(event.body as string);
    const userId = event.pathParameters?.userId;

    // check if user is trying to access others data
    // TODO: modify so that admin have permission to access others data

    if (
      event.requestContext.authorizer?.claims.mongoId !== userId ||
      userId !== projectData.ownerId
    ) {
      return unauthorizedResponse();
    }

    // create a new project
    await connectDB();
    const project = await Project.create({
      ...projectData,
      ownerId: new Types.ObjectId(projectData.ownerId),
      ...(projectData._id ? { _id: new Types.ObjectId(projectData._id) } : {}),
    });

    return jsonResponse(201, {
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error: any) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      return handleDuplicateKeyError(error.message);
    }
    return jsonResponse(500, {
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const handler = middy(lambdaHandler).use(
  bodyValidator(createProjectBodySchema)
);
