import middy from "@middy/core";
import { APIGatewayProxyHandler } from "aws-lambda";
import { connectDB } from "src/config/mongo";
import { handleDuplicateKeyError } from "src/helper/handleDuplicateKeyError";
import { jsonResponse, unauthorizedResponse } from "src/helper/jsonResponse";
import { zodMongoObjectId } from "src/helper/zodObjectIdTypes";
import { bodyValidator } from "src/middleware/validator";
import { Collaborator, createCollaboratorSchema } from "src/model/collaborator";

import { ZodError, z } from "zod";

const requestBodyValidatorSchema = createCollaboratorSchema.pick({
  email: true,
});
type requestBodyValidatorSchemaType = z.infer<
  typeof requestBodyValidatorSchema
>;

const lambdaHandler: APIGatewayProxyHandler = async (event, context) => {
  try {
    const userId = zodMongoObjectId("userId").parse(
      event.pathParameters?.userId
    );

    const projectId = zodMongoObjectId("projectId").parse(
      event.pathParameters?.projectId
    );

    // check if user accessing its own data or not
    if (event.requestContext.authorizer?.claims.mongoId !== userId) {
      return unauthorizedResponse();
    }

    const collaboratorData: requestBodyValidatorSchemaType = JSON.parse(
      event.body as string
    );

    await connectDB();
    const collaborator = await Collaborator.create({
      projectId: projectId,
      email: collaboratorData.email,
    });

    return jsonResponse(201, {
      success: true,
      data: collaborator,
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
  bodyValidator(requestBodyValidatorSchema)
);
