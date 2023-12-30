import { AWS } from "@serverless/typescript";
import { default as auth } from "./authorizor";
import { default as user } from "./user";
import { default as project } from "./project";
import { default as chat } from "./chat";
import { default as conversation } from "./conversation";
import { default as interviewee } from "./interviewee";
// import { default as otherFunctions } from "./otherFunctions";
export default {
  ...auth,
  ...user,
  ...project,
  ...chat,
  ...conversation,
  ...interviewee,
  // ...otherFunctions,
} as AWS["functions"];
