import { roomsCollection } from '../lib/mongo';


export async function GET({ params, request }: any) {
    const url: URL = new URL(request.url);
    const ownerperson: string | null = url.searchParams.get('owner');
    console.log(ownerperson)
    const items = await roomsCollection.findOne({ owner: ownerperson });

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