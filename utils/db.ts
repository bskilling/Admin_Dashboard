import mongoose from "mongoose";
require("dotenv").config();

const dbUrl: string = process.env.DB_URL || "";
const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl).then((data: any) => {
      console.log(
        `Database connection established with ${data.connection.host}`
      );
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(String(error));
    }
    console.log(dbUrl);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
