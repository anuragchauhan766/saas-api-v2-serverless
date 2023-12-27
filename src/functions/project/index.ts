import { handlerPath } from "@libs/handler-resolver";
import { AWS } from "@serverless/typescript";

export default {
  createProject: {
    handler: `${handlerPath(__dirname)}/createProject.handler`,
    events: [
      {
        http: {
          method: "post",
          path: "/user/{userId}/project",
          authorizer: "${self:custom.authorizer.firebaseJwtVerifier}",
        },
      },
    ],
  },
  getProjects: {
    handler: `${handlerPath(__dirname)}/getProjects.handler`,
    events: [
      {
        http: {
          method: "get",
          path: "/user/{userId}/project",
          authorizer: "${self:custom.authorizer.firebaseJwtVerifier}",
        },
      },
    ],
  },
} as AWS["functions"];
