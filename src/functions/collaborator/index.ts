import { handlerPath } from "@libs/handler-resolver";
import { AWS } from "@serverless/typescript";

export default {
  createCollaborator: {
    handler: `${handlerPath(__dirname)}/createCollaborator.handler`,
    events: [
      {
        http: {
          method: "post",
          path: "/user/{userId}/project/{projectId}/collaborator",
          authorizer: "${self:custom.authorizer.firebaseJwtVerifier}",
        },
      },
    ],
  },
  getCollaborators: {
    handler: `${handlerPath(__dirname)}/getCollaborators.handler`,
    events: [
      {
        http: {
          method: "get",
          path: "/user/{userId}/project/{projectId}/collaborator",
          authorizer: "${self:custom.authorizer.firebaseJwtVerifier}",
        },
      },
    ],
  },
  deleteCollaborator: {
    handler: `${handlerPath(__dirname)}/deleteCollaborator.handler`,
    events: [
      {
        http: {
          method: "delete",
          path: "/user/{userId}/project/{projectId}/collaborator/{email}",
          authorizer: "${self:custom.authorizer.firebaseJwtVerifier}",
        },
      },
    ],
  },
} as AWS["functions"];
