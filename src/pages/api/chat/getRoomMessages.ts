import { roomsCollection } from '../lib/mongo';


export async function GET({ params, request }: any) {
    const url: URL = new URL(request.url);
    const ownerperson: string | null = url.searchParams.get('owner');
    console.log(ownerperson)
    const items: any = await roomsCollection.findOne({ owner: ownerperson });
    if (items == null){
        return new Response(
            JSON.stringify([]), 
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
    console.log(items)
    return new Response(
        JSON.stringify(items.messages), 
        {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

}