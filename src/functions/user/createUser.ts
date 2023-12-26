import middy from "@middy/core";
import { APIGatewayProxyHandler } from "aws-lambda";
import { getAuth } from "firebase-admin/auth";
import { initializeFirebaseSdk } from "src/config/firebase";
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
    const user = await User.create({ _id, name, email, role, accountType });

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
    });
  } catch (error: any) {
    return jsonResponse(500, {
      success: false,
      message: "Internal server error, Could not create user",
      error: error,
    });
  }
};

export const handler = middy(lambdaHandler)
  //   .use(jsonBodyParser())
  .use(bodyValidator(createUserBodySchema));
