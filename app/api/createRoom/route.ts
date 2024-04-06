import { API } from '@huddle01/server-sdk/api';

export async function GET(req: Request, res: Response) {
    const collectionAddress = new URL(req.url).searchParams.get('collectionAddress');

    console.log('collectionAddress', collectionAddress);

    if (!collectionAddress) {
        return new Response('collectionAddress is required', { status: 400 });
    }

    const api = new API({
        apiKey: process.env.API_KEY!,
    });

    const createNewRoom = await api.createRoom({
        title: 'Token Gated Room SolSync',
        tokenType: 'SPL',
        chain: 'SOLANA',
        contractAddress: [collectionAddress as string],
    });

    if (createNewRoom.error) {
        return new Response(String(createNewRoom.error), { status: 500 });
    }

    return new Response(JSON.stringify({ roomId: createNewRoom.data.data.roomId }), { status: 200 });
}
