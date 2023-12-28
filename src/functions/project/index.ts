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
  updateProject: {
    handler: `${handlerPath(__dirname)}/updateProject.handler`,
    events: [
      {
        http: {
          method: "put",
          path: "/user/{userId}/project/{projectId}",
          authorizer: "${self:custom.authorizer.firebaseJwtVerifier}",
        },
      },
    ],
  },
  deleteProject: {
    handler: `${handlerPath(__dirname)}/deleteProject.handler`,
    events: [
      {
        http: {
          method: "delete",
          path: "/user/{userId}/project/{projectId}",
          authorizer: "${self:custom.authorizer.firebaseJwtVerifier}",
        },
      },
    ],
  },
} as AWS["functions"];
