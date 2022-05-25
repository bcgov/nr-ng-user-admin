export interface ForestClientResponse {
    items: Array<ForestClientElement>
}


export interface ForestClientElement {
    forest_client_id: number;
    forest_client_number: string;
    forest_client_name: string;
}