import middy from "@middy/core";
import { APIGatewayProxyHandler } from "aws-lambda";

import { connectDB } from "src/config/mongo";
import { handleDuplicateKeyError } from "src/helper/handleDuplicateKeyError";
import { jsonResponse, unauthorizedResponse } from "src/helper/jsonResponse";
import { zodMongoObjectId } from "src/helper/zodObjectIdTypes";
import { bodyValidator } from "src/middleware/validator";

import {
  IResumeScreener,
  ResumeScreener,
  createResumeScreenerSchema,
} from "src/model/resumeScreener";
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

    const resumeScreenerData: Omit<IResumeScreener, "projectId"> = JSON.parse(
      event.body as string
    );
    await connectDB();

    const resumeScreener = await ResumeScreener.create({
      ...resumeScreenerData,
      projectId,
    });
    return jsonResponse(201, {
      success: true,
      data: resumeScreener,
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

export const handler = middy(lambdaHandler).use(
  bodyValidator(createResumeScreenerSchema.omit({ projectId: true }))
);
