import middy from "@middy/core";

import { APIGatewayProxyHandler } from "aws-lambda";

import { connectDB } from "src/config/mongo";

import { jsonResponse } from "src/helper/jsonResponse";
import { bodyValidator } from "src/middleware/validator";
import { User } from "src/model/user";
import { z } from "zod";

export const updateUserBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Please provide valid email").optional(),
  role: z.enum(["developer", "subscriber"]).optional(),
  accountType: z.enum(["bussiness", "education"]).optional(),
});
const lambdaHandler: APIGatewayProxyHandler = async (event, context) => {
  // TODO: apply security so that a user can only update its owns info

  try {
    if (!event.queryStringParameters) {
      return jsonResponse(400, {
        success: false,
        messgae:
          "Please provide the required Query parameter , either 'email' or 'id'",
      });
    }
    const { email, id } = event.queryStringParameters;
    if (!(email || id)) {
      return jsonResponse(400, {
        success: false,
        messgae:
          "Please provide valid query parameter, accepted parameter are 'email' or 'id'",
      });
    }
    const filter = id ? { _id: id } : { email };
    const updateObject = JSON.parse(event.body as string);
    await connectDB();
    const user = await User.findOneAndUpdate(filter, updateObject, {
      new: true,
    });
    return jsonResponse(200, {
      success: true,
      messgae: "User updated successfully",
      user,
    });
  } catch (error: any) {
    return jsonResponse(500, {
      success: false,
      message: "Internal server error, Could not update user",
      error: error.message,
    });
  }
};

export const handler = middy(lambdaHandler).use(
  bodyValidator(updateUserBodySchema)
);
