import axios from 'axios';
import { API_DOMAIN } from '../env';

const instance = axios.create({
  baseURL: API_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface SearchRequestParams {
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
export interface SearchResponse {
  items: Item[];
  total: number;
}
export const getItemList = async (
  params: SearchRequestParams,
): Promise<SearchResponse> => {
  const data = await instance.post('item/search', JSON.stringify(params));
  return data.data.data;
};

export const getPurchaseList = (data: any) => {
  return instance.post('purchase/search', JSON.stringify(data)).then((data) => {
    return data.data.data;
  });
};

export const getItemDetail = (groupId: string) => {
  return instance.get(`item_by_group/${groupId}`).then((data) => {
    return data?.data?.data?.item || {};
  });
};

interface IItemCategoriesResponse {
  id: number;
  name: string;
}
export const getCategoryMap = async (): Promise<IItemCategoriesResponse[]> => {
  const data = await instance.get('item/categories');
  return data?.data?.data?.categories || [];
  // .then((data) => {
  //   return data?.data?.data?.categories || [];
  // });
};

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
export const getItem = async (id: number): Promise<Item> => {
  const data = await instance.get(`item/${id}`);
  return data?.data?.data?.item || {};
};

export const getItems = async (ids: number[]): Promise<Item[]> => {
  const data = await instance.post(`item/batch`, { ids });
  return data?.data?.data?.items || [];
};
