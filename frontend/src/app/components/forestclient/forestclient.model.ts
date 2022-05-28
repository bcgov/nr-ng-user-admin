export interface ForestClientResponse {
    items: Array<ForestClientElement>;
    total: number;
    limit: number;
    offset: number;
}


export interface ForestClientElement {
    forest_client_id: number;
    forest_client_number: string;
    forest_client_name: string;
}