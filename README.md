# saas-api-v2-serverless

### Prerequisites

- [Install Serverless Framework](https://www.serverless.com/framework/docs/getting-started/)
- [Configure AWS Credentials](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/)

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npm run dev` to run the server locally
- Run `npm run deploy` to deploy this stack to AWS

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas

```
.
├── src
│   ├── functions               # Lambda configuration and source code folder
│   │   ├── hello
│   │   │   ├── handler.ts      # `Hello` lambda source code
│   │   │   ├── index.ts        # `Hello` lambda Serverless configuration
│   │   │   ├── mock.json       # `Hello` lambda input parameter, if any, for local invocation
│   │   │   └── schema.ts       # `Hello` lambda input event JSON-Schema
│   │   │
│   │   └── index.ts            # Import/export of all lambda configurations
│   │
│   |── libs                    # Lambda shared code
│   |   └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│   |── config                  # config files
│   |   └── firebase.ts
│   |   └── mongodb.ts
│   └── helpers                 # Lambda helper functions
│       └── jsonResponse.ts     # helper function for send json response
│
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
└── tsconfig.paths.json         # Typescript paths

```
