import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { APIGatewayProxyHandler } from "aws-lambda";
import { jsonResponse } from "src/helper/jsonResponse";
import { bodyValidator } from "src/middleware/validator";
import { z } from "zod";
const createUserBodySchema = z.object({
  name: z.string().min(1, "Please provide name"),
  email: z
    .string()
    .min(1, "Please provide email")
    .email("Please provide valid email"),
});

const lambdaHandler: APIGatewayProxyHandler = async (event, context) => {
  console.log(event.requestContext.authorizer);
  console.log(event.body);
  return jsonResponse(200, {
    success: true,
    messgae: "hello,  user created successfully",
  });
};

export const handler = middy(lambdaHandler)
  //   .use(jsonBodyParser())
  .use(bodyValidator(createUserBodySchema));
