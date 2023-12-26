import { handlerPath } from "@libs/handler-resolver";
import { AWS } from "@serverless/typescript";

export default {
  createProject: {
    handler: `${handlerPath(__dirname)}/createProject.handler`,
    events: [
      {
        http: {
          method: "post",
          path: "/user/{id}/project",
          authorizer: "${self:custom.authorizer.firebaseJwtVerifier}",
        },
      },
    ],
  },
} as AWS["functions"];
