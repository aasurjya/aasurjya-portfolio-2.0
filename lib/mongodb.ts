import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI || ''
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise

let indexesEnsured = false

async function ensureIndexes(db: Db): Promise<void> {
  if (indexesEnsured) return
  indexesEnsured = true

  try {
    const opts = { background: true }

    await Promise.all([
      // visitors collection
      db.collection('visitors').createIndex({ timestamp: -1 }, opts),
      db.collection('visitors').createIndex({ visitorId: 1, sessionId: 1 }, opts),

      // page_sessions collection
      db.collection('page_sessions').createIndex({ sessionId: 1 }, opts),
      db.collection('page_sessions').createIndex({ timestamp: -1 }, opts),

      // section_durations collection
      db.collection('section_durations').createIndex({ sectionId: 1 }, opts),
      db.collection('section_durations').createIndex({ sessionId: 1 }, opts),

      // interaction_events collection
      db.collection('interaction_events').createIndex({ eventType: 1 }, opts),
      db.collection('interaction_events').createIndex({ timestamp: -1 }, opts),
      db.collection('interaction_events').createIndex({ visitorId: 1 }, opts),
    ])
  } catch (error) {
    console.error('Failed to ensure indexes:', error)
    // Don't block the app if index creation fails
  }
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  const db = client.db('portfolio')
  await ensureIndexes(db)
  return db
}

export interface Visitor {
  _id?: string
  visitorId?: string | null
  sessionId?: string | null
  ip: string
  pathname?: string | null
  city?: string
  country?: string
  region?: string
  latitude?: number
  longitude?: number
  mode?: string
  timestamp: Date
  lastSeen?: Date
  isNewSession?: boolean
  userAgent?: string
  referrer?: string
  screenResolution?: string
}
