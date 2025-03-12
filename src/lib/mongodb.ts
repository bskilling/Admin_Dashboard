import { MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.DATABASE_URL ?? ""; // Ensure the connection string exists
const options: MongoClientOptions = {}; // You can define additional options if needed

if (!uri) {
  throw new Error("Please add your MongoDB connection string to .env");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Ensure global connection reuse in development
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // ✅ Use the same client in production as well
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
}

export default clientPromise;
