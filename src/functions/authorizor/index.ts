import { handlerPath } from "@libs/handler-resolver";
import { AWS } from "@serverless/typescript";

export default {
  auth: {
    handler: `${handlerPath(__dirname)}/authorizor.tokenAuthorizer`,
  },
} as AWS["functions"];
