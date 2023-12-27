import { APIGatewayProxyResult, APIGatewayProxyResultV2 } from "aws-lambda";

export const jsonResponse = (
  statusCode: number,
  body: Record<string, unknown>
): APIGatewayProxyResult => {
  const response: APIGatewayProxyResult = {
    headers: {
      "Content-Type": "application/json",
    },
    statusCode,
    body: JSON.stringify(body),
  };
  return response;
};

export const unauthorizedResponse = (): APIGatewayProxyResult =>
  jsonResponse(401, {
    success: false,
    name: "Unauthorized",
    message: "Unauthorized: You are not authorized to perform this action",
  });
