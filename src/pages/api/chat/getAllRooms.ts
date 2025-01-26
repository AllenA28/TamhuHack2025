import { roomsCollection } from '../lib/mongo';


export async function GET({ request }: any) {
    
    const items: any = await roomsCollection.find().toArray();

    console.log(items)
    return new Response(
        JSON.stringify(items), 
        {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}