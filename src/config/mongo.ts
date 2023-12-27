import mongoose from "mongoose";

let conn: typeof mongoose | null = null;

export const connectDB = async function (): Promise<typeof mongoose | null> {
  if (conn === null) {
    console.log("Connecting to new connecton...");
    conn = await mongoose.connect(process.env.DB as string, {
      serverSelectionTimeoutMS: 5000,
      dbName: "debales",
    });

    // `await`ing connection after assigning to the `conn` variable
    // to avoid multiple function calls creating new connections

    return conn;
  }
  console.log("Using existing connection");
  return conn;
};
