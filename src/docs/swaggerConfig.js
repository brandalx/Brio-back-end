import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
// Set up Swagger options and generate the Swagger documentation

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Brio REST API",
      version: "1.0.0",
      description: "Brio REST API ",
    },
    servers: [
      {
        url: "Brio Sever",

        description: "Default server connection",
      },
    ],
  },
  // All api route files for swagger docs
  apis: [
    "./src/docs/swaggerRestaurantsClient.yaml",
    "./src/docs/swaggerRestaurantsSeller.yaml",
  ],
};

// Generate the Swagger documentation using the defined options
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Set up Swagger middleware for use in the Express app
export const swaggerUiMiddleware = [
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs),
];
