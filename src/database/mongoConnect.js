//database connect

import mongoose from "mongoose";
//urldb from configs file
import { urldb } from "../configs/config.js";
export async function main() {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(urldb);
    console.log("Connected to database of the Brio ✨");
  } catch (err) {
    console.log(err);
  }
}
