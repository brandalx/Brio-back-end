import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { urldb, localurldb } from "../configs/config.js";
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
        url: urldb,

        description: "The adress is " + urldb,
      },
      {
        url: urldb,

        description: "The adress is " + urldb,
      },
    ],
  },
  // API schema model for all routes
  apis: [
    "./docs/swaggerRestaurantsClient.js",
    "./docs/swaggerRestaurantsSeller.js",
  ],
};

// Generate the Swagger documentation using the defined options
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Set up Swagger middleware for use in the Express app
export const swaggerUiMiddleware = [
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs),
];
