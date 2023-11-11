import axios from 'axios';
import { API_DOMAIN } from '../../env';
import {
  Item,
  SearchItemsRequest,
  SearchItemsResponse,
  CategoriesResponse,
  SearchPurchaseRequest,
  SearchPurchaseResponse,
} from './types';

const instance = axios.create({
  baseURL: API_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchItems = async (
  params: SearchItemsRequest,
): Promise<SearchItemsResponse> => {
  const data = await instance.post('item/search', JSON.stringify(params));
  return data.data.data;
};

export const searchPurchase = async (
  params: SearchPurchaseRequest,
): Promise<SearchPurchaseResponse> => {
  const data = await instance.post('purchase/search', JSON.stringify(params));

  return data.data.data;
};

export const getCategoryMap = async (): Promise<CategoriesResponse[]> => {
  const data = await instance.get('item/categories');
  return data?.data?.data?.categories || [];
};

export const getItemsById = async (ids: number[]): Promise<Item[]> => {
  const data = await instance.post(`item/batch`, { ids });
  return data?.data?.data?.items || [];
};

export const getItemByBucketId = async (bucketId: string): Promise<Item> => {
  const data = await instance.get(`item_by_bucket/${bucketId}`);

  return data?.data?.data?.item || {};
};

export const getItemByObjectId = async (objectId: string): Promise<Item> => {
  const data = await instance.get(`item_by_object/${objectId}`);

  return data?.data?.data?.item || {};
};

export const getItemById = async (id: number): Promise<Item> => {
  const data = await instance.get(`item/${id}`);
  return data?.data?.data?.item || {};
};

export const getItemByGroupId = async (groupId: string) => {
  const data = await instance.get(`item_by_group/${groupId}`);
  return data?.data?.data?.item || {};
};
