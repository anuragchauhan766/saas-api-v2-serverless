import middy from "@middy/core";

import { APIGatewayProxyHandler } from "aws-lambda";
import { MongooseError } from "mongoose";
import { connectDB } from "src/config/mongo";

import { jsonResponse } from "src/helper/jsonResponse";
import { bodyValidator } from "src/middleware/validator";
import { User, createUserBodySchema } from "src/model/user";

const lambdaHandler: APIGatewayProxyHandler = async (event, context) => {
  try {
    console.log(event.requestContext.authorizer);
    await connectDB();
    const { _id, name, email, role, accountType } = JSON.parse(
      event.body as string
    );
    await User.create({ _id, name, email, role, accountType });
    return jsonResponse(200, {
      success: true,
      messgae: "User created successfully",
    });
  } catch (error: any) {
    return jsonResponse(500, {
      success: false,
      message: "Internal server error, Could not create user",
      error: error.message,
    });
  }
};

export const handler = middy(lambdaHandler)
  //   .use(jsonBodyParser())
  .use(bodyValidator(createUserBodySchema));
