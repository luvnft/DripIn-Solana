import { API } from "@huddle01/server-sdk/api";
import type { NextRequest } from "next/server";
import { SigninMessage } from "@/lib/huddle01/SignInMessage";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import { ItemsResponseForHuddle } from "@/types/SearchAssetsType";

export async function GET(req: NextRequest, res: Response) {
    const { roomId, address, displayName, expirationTime, signature, domain } = req.body as unknown as {
        roomId: string;
        address: string;
        displayName: string;
        expirationTime: number;
        signature: string;
        domain: string;
    };

    if (!roomId || !address) {
        return new Response("Invalid Request", { status: 400 });
    }

    if (expirationTime < Date.now()) {
        return new Response("Signature expired", { status: 400 });
    }

    const api = new API({
        apiKey: process.env.API_KEY!,
    });

    const { data: roomDetails } = await api.getRoomDetails({
        roomId: roomId,
    });

    if (!roomDetails?.tokenGatingInfo) {
        return new Response("Room is not token gated", { status: 400 });
    }

    const signInMessage = new SigninMessage({
        domain,
        publicKey: address,
        expTime: new Date(expirationTime).toISOString(),
        statement: "Please Sign In to verify wallet",
    });

    const isVerified = await signInMessage.validate(signature);

    if (!isVerified) {
        return new Response("Invalid Signature", { status: 400 });
    }

    const collectionAddress = roomDetails?.tokenGatingInfo?.tokenGatingConditions[0]?.contractAddress;

    const apiResponse = await fetch(
        `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}` || "https://mainnet.helius-rpc.com", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: "my-id",
            method: "searchAssets",
            params: {
                ownerAddress: address,
                grouping: ["collection", `${collectionAddress}`],
                tokenType: "all",
                displayOptions: {
                    showCollectionMetadata: true,
                },
            },
        }),
    }
    );

    const nftData = (await apiResponse.json()) as {
        result: ItemsResponseForHuddle;
    };

    if (nftData.result.items.length === 0) {
        return new Response("User does not own the required NFT", { status: 400 });
    }

    const accessToken = new AccessToken({
        apiKey: process.env.API_KEY!,
        roomId: roomId as string,
        role: Role.HOST,
        permissions: {
            admin: true,
            canConsume: true,
            canProduce: true,
            canProduceSources: {
                cam: true,
                mic: true,
                screen: true,
            },
            canRecvData: true,
            canSendData: true,
            canUpdateMetadata: true,
        },
        options: {
            metadata: {
                displayName: displayName,
                walletAddress: address,
            },
        },
    });

    const token = await accessToken.toJwt();

    return new Response(JSON.stringify({ token }), { status: 200 });
}
