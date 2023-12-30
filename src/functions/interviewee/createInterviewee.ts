import middy from "@middy/core";
import { APIGatewayProxyHandler } from "aws-lambda";
import { connectDB } from "src/config/mongo";
import { handleDuplicateKeyError } from "src/helper/handleDuplicateKeyError";
import { jsonResponse } from "src/helper/jsonResponse";
import { zodMongoObjectId } from "src/helper/zodObjectIdTypes";
import { bodyValidator } from "src/middleware/validator";
import {
  IInterviewee,
  Interviewee,
  createIntervieweeSchema,
} from "src/model/interviewee";

const lambdaHandler: APIGatewayProxyHandler = async (event, context) => {
  try {
    const intervieweeData: IInterviewee = JSON.parse(event.body as string);

    await connectDB();
    const interviewee = await Interviewee.create(intervieweeData);

    return jsonResponse(201, {
      success: true,
      data: interviewee,
    });
  } catch (error: any) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      return handleDuplicateKeyError(error.message);
    }
    return jsonResponse(500, {
      success: false,
      message: "Internal server error, Could not create user",
      error: error,
    });
  }
};

export const handler = middy(lambdaHandler)
  //   .use(jsonBodyParser())
  .use(bodyValidator(createIntervieweeSchema));
