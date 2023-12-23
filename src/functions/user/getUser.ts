import { APIGatewayProxyHandler } from "aws-lambda";
import { jsonResponse } from "src/helper/jsonResponse";
import { getAuth } from "firebase-admin/auth";
import { initializeFirebaseSdk } from "src/config/firebase";

const lambdaHandler: APIGatewayProxyHandler = async (event, context) => {
  try {
    initializeFirebaseSdk();
    const user = await getAuth().getUser("xzMItWRqVUTY33jMe3RCLq4Ef1n2");

    return jsonResponse(200, {
      success: true,
      messgae: "user data is listed below",
      user,
    });
  } catch (error) {
    return jsonResponse(500, {
      success: false,
      messgae: "Internal server error",
      error,
    });
  }
};
export const handler = lambdaHandler;
