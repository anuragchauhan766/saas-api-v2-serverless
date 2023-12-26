import type { AWS } from "@serverless/typescript";
import functions from "@functions/index";
const serverlessConfiguration: AWS = {
  service: "saas-api-v2-serverless",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-offline",
    "serverless-dotenv-plugin",
  ],
  useDotenv: true,
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    region: "${opt:region, 'ap-south-1'}" as "ap-south-1",
    stage: "${opt:stage, 'dev'}",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },

  // import the function via paths
  functions,
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    authorizer: {
      firebaseJwtVerifier: {
        name: "auth",
        type: "token",
        identitySource: "method.request.header.Authorization",
        identityValidationExpression: "Bearer (.*)",
      },
    },
  },
};

module.exports = serverlessConfiguration;
