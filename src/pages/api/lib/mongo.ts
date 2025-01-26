import { MongoClient } from 'mongodb';

const client = new MongoClient(import.meta.env.MONGO_CONNECTION);
const db = client.db('livemessage');
export const roomsCollection = db.collection('rooms');