"use client";

import { useEffect, useState } from "react";
import fetchTokens from "../lib/searchAssets";

export default function Home(req: any, res: any) {
    const [tokens, setTokens] = useState<any>(null);

    useEffect(() => {
        fetchTokens("7KFerXQA71zx5nLGiqFz6mcDTWBzYAoAWXf9EkRbGx8u").then(setTokens).catch(console.error);
    }, []);

    return (
        <div>
            <h1>Search Assets</h1>
            <pre>{JSON.stringify(tokens, null, 2)}</pre>
        </div>
    );

}
