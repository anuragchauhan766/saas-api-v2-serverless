import { handlerPath } from "@libs/handler-resolver";
import { AWS } from "@serverless/typescript";

export default {
  getConversations: {
    handler: `${handlerPath(__dirname)}/getConversations.handler`,
    events: [
      {
        http: {
          method: "get",
          path: "/user/{userId}/project/{projectId}/conversation",
          authorizer: "${self:custom.authorizer.firebaseJwtVerifier}",
        },
      },
    ],
  },
} as AWS["functions"];
