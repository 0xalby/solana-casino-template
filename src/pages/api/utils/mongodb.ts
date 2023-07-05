import { MongoClient, Db  } from "mongodb";
import config from './config'

const uri = config.MONGODB.URI;
const dbName = config.MONGODB.DBNAME;

let cachedDb: Db;

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any;

  const client = await MongoClient.connect(uri, options);
  const db = client.db(dbName);
  cachedDb = db;
  return db;
}