import type { APIRoute } from 'astro';
import { roomsCollection } from '../lib/mongo';

export const POST: APIRoute = async ( {request} ) => {
  
  const { owner, password, video, videotitle } = await request.json();
  

  // Create room document
  const newRoom = {
    owner,
    password,
    messages: [],
    participants: [owner],
    video: video,
    videotime: 0,
    videotitle: videotitle
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