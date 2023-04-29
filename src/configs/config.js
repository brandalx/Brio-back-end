// Initializing environment variables
import { config } from "dotenv";
config();
export const urldb = process.env.URLDB;
export const localurldb = process.env.LOCALURLDB;
export const port = Number(process.env.PORT) || 3001;
