import { APIGatewayProxyResult, APIGatewayProxyResultV2 } from "aws-lambda";

export const jsonResponse = (
  statusCode: number,
  body: any
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
