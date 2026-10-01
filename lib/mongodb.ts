import mongoose from "mongoose";

// Connection cache across Next.js App Router hot reloads
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

let memoryServerInstance: any = null;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    let uri = process.env.MONGODB_URI || "mongodb://localhost:27017/studyflow_telemetry";

    // Attempt connecting to configured URI, or fallback cleanly to embedded MongoMemoryServer
    cached.promise = (async () => {
      try {
        const conn = await mongoose.connect(uri, opts);
        console.log("🍃 Connected to MongoDB via standard connection URI.");
        return conn;
      } catch (externalErr) {
        console.warn("⚠️ Local/External MongoDB unreachable on port 27017. Spinning up self-contained MongoMemoryServer instance...");
        try {
          const { MongoMemoryServer } = await import("mongodb-memory-server");
          if (!memoryServerInstance) {
            memoryServerInstance = await MongoMemoryServer.create({
              instance: { dbName: "studyflow_telemetry" },
            });
          }
          const memoryUri = memoryServerInstance.getUri();
          console.log(`🍃 Connected to Embedded MongoMemoryServer at: ${memoryUri}`);
          return await mongoose.connect(memoryUri, opts);
        } catch (memErr) {
          console.error("❌ Failed to initialize MongoMemoryServer fallback:", memErr);
          throw memErr;
        }
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
