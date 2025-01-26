import type { APIRoute } from 'astro';
import { roomsCollection } from '../lib/mongo';

export const POST: APIRoute = async ( {request} ) => {
  
  const { owner, password } = await request.json();
  

  // Create room document
  const newRoom = {
    owner,
    password,
    messages: [],
    participants: [owner],
  };

  const result = await roomsCollection.insertOne(newRoom);

  return new Response(JSON.stringify({
    roomId: result.insertedId,
  }), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}