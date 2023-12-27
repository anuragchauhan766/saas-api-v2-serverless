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
  updateUser: {
    handler: `${handlerPath(__dirname)}/updateUser.handler`,
    events: [
      {
        http: {
          method: "put",
          path: "/user",
          authorizer: "${self:custom.authorizer.firebaseJwtVerifier}",
        },
      },
    ],
  },
  deleteUser: {
    handler: `${handlerPath(__dirname)}/deleteUser.handler`,
    events: [
      {
        http: {
          method: "delete",
          path: "/user",
          authorizer: "${self:custom.authorizer.firebaseJwtVerifier}",
        },
      },
    ],
  },
} as AWS["functions"];
