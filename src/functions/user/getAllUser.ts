import { APIGatewayProxyHandler, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { connectDB } from "src/config/mongo";
import { jsonResponse } from "src/helper/jsonResponse";
import { User } from "src/model/user";

export const handler: APIGatewayProxyHandler = async (event, context) => {
  try {
    await connectDB();
    const users = await User.find({});
    return jsonResponse(200, {
      success: true,
      messgae: "Successfully fetch all users",
      users: users,
    });
  } catch (error) {
    return jsonResponse(200, {
      success: true,
      messgae: "Successfully fetch all users",
      error: error,
    });
  }
};
