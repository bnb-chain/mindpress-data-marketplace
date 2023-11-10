export type Item = {
  id: number;
  categoryId: number;
  type: 'COLLECTION' | 'OBJECT';
  name: string;
  createdAt: number;
  description: string;
  url?: string;
  groupId: number;
  groupName: string;
  ownerAddress: string;
  price: string;
  status: 'LISTED' | 'PENDING' | 'BLOCKED';
  totalSale: number;
  totalVolume: string;
};

export interface SearchItemsRequest {
  filter: {
    address: string;
    categoryId?: number;
    keyword: string;
  };
  sort:
    | 'CREATION_DESC'
    | 'CREATION_ASC'
    | 'TOTAL_VOLUME_ASC'
    | 'TOTAL_VOLUME_DESC'
    | 'TOTAL_SALE_ASC'
    | 'TOTAL_SALE_DESC';
  offset: number;
  limit: number;
}

export interface SearchItemsResponse {
  items: Item[];
  total: number;
}

export interface getCategoriesResponse {
  id: number;
  name: string;
}
