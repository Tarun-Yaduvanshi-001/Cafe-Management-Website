import mongoose from "mongoose";
import config from "./config.js";

const connectMongodb = async () => {
  try {
    const connection = mongoose.connect(config.db.MONGODB_URI);
    console.log("MONGODB ATLAS CONNECTED SUCCESSFULL");
  } catch (error) {
    console.log(error);
  }
};

export default connectMongodb;
