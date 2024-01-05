import { handlerPath } from "@libs/handler-resolver";
import { AWS } from "@serverless/typescript";

export default {
  createGuestUser: {
    handler: `${handlerPath(__dirname)}/createGuestUser.handler`,
    events: [
      {
        http: {
          method: "post",
          path: "/project/{projectId}/guestuser",
        },
      },
    ],
  },
  getGuestUsers: {
    handler: `${handlerPath(__dirname)}/getGuestUsers.handler`,
    events: [
      {
        http: {
          method: "get",
          path: "/project/{projectId}/guestuser",
        },
      },
    ],
  },
} as AWS["functions"];
