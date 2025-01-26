import type { APIRoute } from 'astro';
import { roomsCollection } from '../lib/mongo';

export const POST: APIRoute = async ( {request} ) => {
  
  const { owner, videotime } = await request.json();
  
//   update the video with the current owner
  const result = await roomsCollection.updateOne({ owner: owner }, { $set: { videotime: videotime } });

  return new Response(JSON.stringify(result), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}