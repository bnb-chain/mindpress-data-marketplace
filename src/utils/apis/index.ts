import axios from 'axios';
import { API_DOMAIN } from '../../env';
import {
  Item,
  SearchItemsRequest,
  SearchItemsResponse,
  getCategoriesResponse,
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

export const getCategoryMap = async (): Promise<getCategoriesResponse[]> => {
  const data = await instance.get('item/categories');
  return data?.data?.data?.categories || [];
};

export const getItem = async (id: number): Promise<Item> => {
  const data = await instance.get(`item/${id}`);
  return data?.data?.data?.item || {};
};

export const getItemsById = async (ids: number[]): Promise<Item[]> => {
  const data = await instance.post(`item/batch`, { ids });
  return data?.data?.data?.items || [];
};
