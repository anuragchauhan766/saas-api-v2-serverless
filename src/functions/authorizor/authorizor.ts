import {
  APIGatewayAuthorizerHandler,
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerHandler,
  PolicyDocument,
} from "aws-lambda";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { initializeFirebaseSdk } from "src/config/firebase";

const generatePolicy = function (
  effect: "Allow" | "Deny",
  resource: any,
  token?: DecodedIdToken
): APIGatewayAuthorizerResult {
  const authResponse: APIGatewayAuthorizerResult = {
    principalId: token?.uid ?? "unknown",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };

  // ! uncomment this for production
  // attached user info in context to that next function can  access these details
  console.log(token);
  if (token) {
    authResponse.context = {
      uid: token.uid,
      name: token.name ?? "",
      email: token.email,
    };
  }
  console.log(authResponse);
  // * for Testing
  // authResponse.context = {
  //   uid: "8328420342",
  //   name: "rahul",
  //   email: "rahul@gmail.com",
  // };

  return authResponse;
};

export const tokenAuthorizer: APIGatewayTokenAuthorizerHandler = async (
  event,
  context
) => {
  // // TODO: validate token
  // // TODO: get user from token
  // // TODO: get user permissions

  try {
    // note: JWT token will sent in Authorization Header eg.
    // Authorization: Bearer <Token>
    if (!event.authorizationToken) {
      return generatePolicy("Deny", event.methodArn);
    }

    const tokenParts = event.authorizationToken.split(" ");
    const tokenValue = tokenParts[1];

    if (!(tokenParts[0] === "Bearer" && tokenValue)) {
      return generatePolicy("Deny", event.methodArn);
    }
    // ! uncomment this for production
    initializeFirebaseSdk();
    const decodedToken = await getAuth().verifyIdToken(tokenValue);
    // TODO: check if user has permission to access resource

    return generatePolicy("Allow", event.methodArn, decodedToken);
  } catch (error) {
    console.error(error);
    return generatePolicy("Deny", event.methodArn);
  }
};
