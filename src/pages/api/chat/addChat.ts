import type { APIRoute } from 'astro';
import { roomsCollection } from '../lib/mongo';

export const POST: APIRoute = async ( {request} ) => {
  
  const { owner, message } = await request.json();
  

//   where the owner is, append the message to the messages array
  const result = await roomsCollection.updateOne({ owner: owner }, { $push: { messages: message } });

  return new Response(JSON.stringify(result), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}