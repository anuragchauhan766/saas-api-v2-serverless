import { APIGatewayProxyHandler } from "aws-lambda";
import { jsonResponse } from "src/helper/jsonResponse";
import { getAuth } from "firebase-admin/auth";
import { initializeFirebaseSdk } from "src/config/firebase";
import { connectDB } from "src/config/mongo";
import { IUser, User, createUserBodySchema } from "src/model/user";
import middy from "@middy/core";
import { IProject } from "src/model/project";
import { ZodError } from "zod";
import { Types } from "mongoose";

const lambdaHandler: APIGatewayProxyHandler = async (event, context) => {
  // TODO: apply security so that a user can only get its owns info

  try {
    const claims = event.requestContext.authorizer?.claims;
    const queryParams = event.queryStringParameters;
    await connectDB();
    if (
      (claims.role as IUser["role"]) !== "admin" ||
      ((claims.role as IUser["role"]) === "admin" && queryParams === null)
    ) {
      const user = await User.findOne({ _id: claims.mongoId });

      if (!user) {
        return jsonResponse(404, {
          success: false,
          messgae: "user not found with the given parameter",
        });
      }
      return jsonResponse(200, {
        success: true,
        data: user,
      });
    }
    // if user is admin
    let users: IUser[] = [];
    if (queryParams?.all === "true") {
      users = await User.find({});
    } else {
      const query = createUserBodySchema.partial().parse(queryParams);
      users = await User.find({
        ...query,
      });
    }

    if (users.length === 0) {
      return jsonResponse(404, {
        success: false,
        messgae: "user not found with the given parameter",
      });
    }
    return jsonResponse(200, {
      success: true,
      messgae: "user data is listed below",
      data: users,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      return jsonResponse(400, {
        success: false,
        messgae: "Bad request",
        error: "Invalid query parameters in request URL",
      });
    }
    return jsonResponse(500, {
      success: false,
      messgae: "Internal server error",
      error,
    });
  }
};
export const handler = middy(lambdaHandler);
