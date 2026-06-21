import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}
// chnage let to cosnt and add type annotation {if needed then change this}
const cached: MongooseCache = (global as { mongoose?: MongooseCache }).mongoose ?? { conn: null, promise: null }

if (!(global as { mongoose?: MongooseCache }).mongoose) {
  ;(global as { mongoose?: MongooseCache }).mongoose = cached
}

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI)
  }

  cached.conn = await cached.promise
  return cached.conn
}
