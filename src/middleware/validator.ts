import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { jsonResponse } from "src/helper/jsonResponse";
import { AnyZodObject } from "zod";
import { z, ZodErrorMap } from "zod";

const customErrorMap: ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.received === "undefined") {
      return { message: `Field '${issue.path}' is required.` };
    }
    if (issue.received === "null") {
      return { message: `Field '${issue.path}' cannot be null.` };
    }
    return {
      message: `Invalid type: field '${issue.path}' should be '${issue.expected}' but got '${issue.received}'`,
    };
  }
  if (issue.code === z.ZodIssueCode.unrecognized_keys) {
    return {
      message:
        "Unrecognized keys: " +
        issue.keys.map((el) => `'${el}'`).join(", ") +
        (issue.path.length === 0 ? "" : " in " + issue.path),
    };
  }

  if (issue.code === z.ZodIssueCode.invalid_union) {
    const unionError = issue.unionErrors
      .map((er) => er.issues.map((i) => customErrorMap(i, ctx)))
      .flat();
    return unionError[0];
  }
  return { message: ctx.defaultError };
};

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
    const data = schema.safeParse(JSON.parse(body), {
      errorMap: customErrorMap,
    });
    if (data.success) {
      return;
    }

    //  TODO: formate the error in meaningfull way
    return jsonResponse(422, {
      name: "Validator Error",
      error: data.error.issues.map((err) => err.message),
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
