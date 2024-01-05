import { handlerPath } from "@libs/handler-resolver";
import { AWS } from "@serverless/typescript";

export default {
  createResumeScreener: {
    handler: `${handlerPath(__dirname)}/createResumeScreener.handler`,
    events: [
      {
        http: {
          method: "post",
          path: "/user/{userId}/project/{projectId}/resume",
          authorizer: "${self:custom.authorizer.firebaseJwtVerifier}",
        },
      },
    ],
  },
  getResumeScreener: {
    handler: `${handlerPath(__dirname)}/getResumeScreener.handler`,
    events: [
      {
        http: {
          method: "get",
          path: "/user/{userId}/project/{projectId}/resume",
          authorizer: "${self:custom.authorizer.firebaseJwtVerifier}",
        },
      },
    ],
  },
} as AWS["functions"];
