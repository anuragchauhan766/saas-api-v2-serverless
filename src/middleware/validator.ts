import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { jsonResponse } from "src/helper/jsonResponse";
import { AnyZodObject, ZodEffects, ZodType, ZodTypeAny } from "zod";

export const bodyValidator = (
  schema: AnyZodObject
): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const before: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
  > = async (request): Promise<void | APIGatewayProxyResult> => {
    const { body } = request.event;
    if (!body) {
      return jsonResponse(400, { error: "Body is missing in request" });
    }
    const data = schema.safeParse(JSON.parse(body));
    if (data.success) {
      return;
    }

    //  TODO: formate the error in meaningfull way
    return jsonResponse(422, {
      name: "Validator Error",
      error: data.error.flatten().fieldErrors,
    });
  };
  return {
    before,
  };
};

// export const queryValidator = <T extends ZodTypeAny>(
//   schema: T
// ): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
//   const before: middy.MiddlewareFn<
//     APIGatewayProxyEvent,
//     APIGatewayProxyResult
//   > = async (request): Promise<void | APIGatewayProxyResult> => {
//     const { queryStringParameters } = request.event;
//     if (!queryStringParameters) {
//       return jsonResponse(400, {
//         error: "Missing the required request query parameter",
//       });
//     }
//     const data = schema.safeParse(queryStringParameters);
//     if (data.success) {
//       return;
//     }

//     //  TODO: formate the error in meaningfull way
//     return jsonResponse(422, {
//       name: "Query Validator Error",
//       message: "Please provide valid query parameter",
//       err: data.error,
//       error: data.error.flatten().fieldErrors,
//     });
//   };
//   return {
//     before,
//   };
// };
