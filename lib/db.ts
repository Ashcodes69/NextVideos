import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in env variables");
}

let cached = global.mongoose;

if (!cached) {
  //if no connection then set all the global mongoose variables to null
  cached = global.mongoose = { cnn: null, promise: null };
}

export async function connectToDb() {
  if (cached.cnn) {
    // if already have a connection return connection
    return cached.cnn;
  }
  if (!cached.promise) {
    const opts = {
      // use if its on the production
      bufferCommands: true,
      maxPoolSize: 10,
    };

    // if no connection promise then we create a promise
    mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);
  }
  try {
    // once promise resolved successfully we connect it
    cached.cnn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.cnn;
}
