import mongoose from "mongoose";

let cache = global.mongoose;

if (!cache) {
  cache = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectDB = async () => {
  if (cache.conn) {
    return cache.conn;
  }

  if (process.env.MONGODB_URL === "") {
    throw new Error("MONGODB_URL is not defined in environment variables");
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(process.env.MONGODB_URL);
  }

  cache.conn = await cache.promise;

  console.log("MongoDB connected:", cache.conn.connection.host);

  return cache.conn;
};
