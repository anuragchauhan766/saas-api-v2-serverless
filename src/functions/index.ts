import { AWS } from "@serverless/typescript";
import { default as auth } from "./authorizor";
import { default as user } from "./user";
export default {
  ...auth,
  ...user,
  // ...otherFunctions,
} as AWS["functions"];
