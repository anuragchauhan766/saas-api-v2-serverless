import middy from "@middy/core";
import { APIGatewayProxyHandler } from "aws-lambda";
import { getAuth } from "firebase-admin/auth";
import { Types } from "mongoose";
import { initializeFirebaseSdk } from "src/config/firebase";
import { connectDB } from "src/config/mongo";
import { handleDuplicateKeyError } from "src/helper/handleDuplicateKeyError";
import { jsonResponse } from "src/helper/jsonResponse";
import { bodyValidator } from "src/middleware/validator";
import { IUser, User, createUserBodySchema } from "src/model/user";

const lambdaHandler: APIGatewayProxyHandler = async (event, context) => {
  try {
    await connectDB();
    const userData: IUser = JSON.parse(event.body as string);

    const user = await User.create({
      ...userData,
      ...(userData._id ? { _id: new Types.ObjectId(userData._id) } : {}),
    });

    // !! uncomment this in production
    // set the user's mongodb object id in custom claims
    initializeFirebaseSdk();
    await getAuth().setCustomUserClaims(event.requestContext.authorizer?.uid, {
      mongoId: user._id,
      role: user.role,
      accountType: user.accountType,
    });

    return jsonResponse(200, {
      success: true,
      messgae: "User created successfully",
      data: user,
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

export const handler = middy(lambdaHandler).use(
  bodyValidator(createUserBodySchema)
);
