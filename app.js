import express from "express";
import http from "http";
import path, { dirname } from "path";

import cors from "cors";
import { fileURLToPath } from "url";
import { main } from "./src/database/mongoConnect.js";
import { config } from "dotenv";

// Routes initilization
import { routesInit } from "./src/routes/configRoutes.js";
import { port } from "./src/configs/config.js";

// Connect to the MongoDB database
main().catch((err) => console.log(err));

// getting the current directory path using the URL of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));
config();

// creating an instance of the express
const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming request body as JSON
app.use(express.json());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// initilization of the routes
routesInit(app);

// HTTP server initilization and listening for requests
const server = http.createServer(app);

server.listen(port);
