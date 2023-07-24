import express from "express";
import http from "http";
import path, { dirname } from "path";

import fileUpload from "express-fileupload";

import cors from "cors";
import { fileURLToPath } from "url";
import { main } from "./src/database/mongoConnect.js";
import { config } from "dotenv";
config();

// Routes initilization
import { routesInit } from "./src/routes/configRoutes.js";
import { port } from "./src/configs/config.js";

// creating an instance of the express
const app = express();
app.use(
  fileUpload({
    // 1024 bytes in 1kb , 1024 kb in 1 mb , 5 (mb) = 5mb
    limits: { fileSize: 1024 * 1024 * 5 },
  })
);
// Parse incoming request body as JSON
app.use(express.json());

// Connect to the MongoDB database
main(); //put it into main clean code

// getting the current directory path using the URL of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Enable Cross-Origin Resource Sharing (CORS)
app.use(
  cors({
    // netlify url (website domain)
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization", "token", "x-api-key"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// Static folder
app.use("/api", express.static(path.join(__dirname, "public")));

// initilization of the routes
routesInit(app);

// HTTP server initilization and listening for requests
const server = http.createServer(app);

app.listen(port, "0.0.0.0");
