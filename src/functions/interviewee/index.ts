import { handlerPath } from "@libs/handler-resolver";
import { AWS } from "@serverless/typescript";

export default {
  createInterviewee: {
    handler: `${handlerPath(__dirname)}/createInterviewee.handler`,
    events: [
      {
        http: {
          method: "post",
          path: "/interviewee",
        },
      },
    ],
  },
  getInterviewwees: {
    handler: `${handlerPath(__dirname)}/getInterviewwees.handler`,
    events: [
      {
        http: {
          method: "get",
          path: "/user/{userId}/project/{projectId}/interviewee",
          authorizer: "${self:custom.authorizer.firebaseJwtVerifier}",
        },
      },
    ],
  },
  deleteInterviewee: {
    handler: `${handlerPath(__dirname)}/deleteInterviewee.handler`,
    events: [
      {
        http: {
          method: "delete",
          path: "/user/{userId}/project/{projectId}/interviewee/{intervieweeId}",
          authorizer: "${self:custom.authorizer.firebaseJwtVerifier}",
        },
      },
    ],
  },
} as AWS["functions"];
