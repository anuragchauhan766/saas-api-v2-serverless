import { handlerPath } from "@libs/handler-resolver";
import { AWS } from "@serverless/typescript";

export default {
  createChat: {
    handler: `${handlerPath(__dirname)}/createChat.handler`,
    events: [
      {
        http: {
          method: "post",
          path: "/user/{userId}/project/{projectId}/chat",
        },
      },
    ],
  },
  getChats: {
    handler: `${handlerPath(__dirname)}/getChats.handler`,
    events: [
      {
        http: {
          method: "get",
          path: "/user/{userId}/project/{projectId}/chat",
        },
      },
    ],
  },
} as AWS["functions"];
