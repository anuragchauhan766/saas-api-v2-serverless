import { handlerPath } from "@libs/handler-resolver";
import { AWS } from "@serverless/typescript";

export default {
  getUser: {
    handler: `${handlerPath(__dirname)}/getUser.handler`,
    events: [
      {
        http: {
          method: "get",
          path: "/user",
        },
      },
    ],
  },
  getAllUser: {
    handler: `${handlerPath(__dirname)}/getAllUser.handler`,
    events: [
      {
        http: {
          method: "get",
          path: "/user/all",
          authorizer: "${self:custom.authorizer.firebaseJwtVerifier}",
        },
      },
    ],
  },
  createUser: {
    handler: `${handlerPath(__dirname)}/createUser.handler`,
    events: [
      {
        http: {
          method: "post",
          path: "/user",
          authorizer: "${self:custom.authorizer.firebaseJwtVerifier}",
        },
      },
    ],
  },
} as AWS["functions"];
