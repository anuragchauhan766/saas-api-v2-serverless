import { APIGatewayProxyHandler, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { jsonResponse } from "src/helper/jsonResponse";

export const handler: APIGatewayProxyHandler = async (event, context) => {
  console.log(event.requestContext.authorizer);
  return jsonResponse(200, {
    success: true,
    messgae: "hello,  this is not authenticated route",
  });
};
