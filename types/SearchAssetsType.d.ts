interface File {
    uri: string;
    cdn_uri?: string;
    mime: string;
}

interface Attribute {
    value: string;
    trait_type: string;
}

interface Metadata {
    attributes: Attribute[];
    description: string;
    name: string;
    symbol: string;
    token_standard: string;
}

interface Links {
    image: string;
    animation_url: string;
    external_url: string;
}

interface CollectionMetadata {
    name: string;
    symbol: string;
    image: string;
    description: string;
    external_url: string;
}

interface Royalty {
    royalty_model: string;
    target: any; // You may replace `any` with appropriate type if known
    percent: number;
    basis_points: number;
    primary_sale_happened: boolean;
    locked: boolean;
}

interface Creator {
    address: string;
    share: number;
    verified: boolean;
}

interface Ownership {
    frozen: boolean;
    delegated: boolean;
    delegate: any; // You may replace `any` with appropriate type if known
    ownership_model: string;
    owner: string;
}

interface Supply {
    print_max_supply: number;
    print_current_supply: number;
    edition_nonce: any; // You may replace `any` with appropriate type if known
}

interface Grouping {
    group_key: string;
    group_value: string;
    collection_metadata: CollectionMetadata;
}

interface Item {
    interface: string;
    id: string;
    content: {
        $schema: string;
        json_uri: string;
        files: File[];
        metadata: Metadata;
        links: Links;
    };
    authorities: { address: string; scopes: string[] }[];
    compression: {
        eligible: boolean;
        compressed: boolean;
        data_hash: string;
        creator_hash: string;
        asset_hash: string;
        tree: string;
        seq: number;
        leaf_id: number;
    };
    grouping: Grouping[];
    royalty: Royalty;
    creators: Creator[];
    ownership: Ownership;
    supply: Supply;
    mutable: boolean;
    burnt: boolean;
}

export interface ItemsResponse {
    items: {
        total: number;
        limit: number;
        cursor: string;
        items: Item[];
    };
}
