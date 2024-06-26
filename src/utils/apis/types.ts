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
  /**
   * resourceId may be bucketId or objectId
   * depending on type
   */
  resourceId: number;
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

export interface CategoriesResponse {
  id: number;
  name: string;
}

export interface SearchPurchaseRequest {
  filter: {
    address?: string;
    itemId?: number;
    bucketId?: number;
    objectId?: number;
  };
  sort: 'CREATION_ASC' | 'CREATION_DESC' | 'PRICE_ASC' | 'PRICE_DESC';
  offset: number;
  limit: number;
}
export interface SearchPurchaseResponse {
  purchases: {
    id: number;
    buyerAddress: string;
    price: number;
    createdAt: number;
    item: Item;
  }[];
  total: number;
}

export interface QueryPurchaseRequest {
  filter: {
    address?: string;
    itemIds?: number[];
    bucketIds?: number[];
    objectIds?: number[];
  };
  sort: 'CREATION_ASC' | 'CREATION_DESC' | 'PRICE_ASC' | 'PRICE_DESC';
  offset: number;
  limit: number;
}
export interface QueryPurchaseResponse {
  purchases: {
    id: number;
    buyerAddress: string;
    price: number;
    createdAt: number;
    item: Item;
  }[];
  total: number;
}
