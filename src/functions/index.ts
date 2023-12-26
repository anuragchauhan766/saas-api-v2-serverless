import { AWS } from "@serverless/typescript";
import { default as auth } from "./authorizor";
import { default as user } from "./user";
import { default as project } from "./project";
// import { default as otherFunctions } from "./otherFunctions";
export default {
  ...auth,
  ...user,
  ...project,
  // ...otherFunctions,
} as AWS["functions"];
