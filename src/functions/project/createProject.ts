import middy from "@middy/core";
import { APIGatewayProxyHandler } from "aws-lambda";
import { jsonResponse } from "src/helper/jsonResponse";
import { bodyValidator } from "src/middleware/validator";
import { Project, createProjectBodySchema } from "src/model/project";

const lambdaHandler: APIGatewayProxyHandler = async (event, context) => {
  try {
    console.log("context", event.requestContext.authorizer);
    const projectData = JSON.parse(event.body as string);
    // console.log(projectData);
    // await Project.create({ ...projectData });
    return jsonResponse(201, {
      success: true,
      message: "Project created successfully",
    });
  } catch (error) {
    console.error(error);
    return jsonResponse(500, {
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export const handler = middy(lambdaHandler).use(
  bodyValidator(createProjectBodySchema)
);
