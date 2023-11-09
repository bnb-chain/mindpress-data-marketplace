import axios from 'axios';
import { API_DOMAIN } from '../env';

const instance = axios.create({
  baseURL: API_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getListedList = (data: any) => {
  return instance.post('item/search', JSON.stringify(data)).then((data) => {
    return data.data.data;
  });
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

type Item = {
  categoryId: number;
  createdAt: number;
  description: string;
  groupId: number;
  groupName: string;
  id: number;
  name: string;
  ownerAddress: string;
  price: string;
  status: 'LISTED' | 'PENDING' | 'BLOCKED';
  totalSale: number;
  totalVolume: string;
  type: 'COLLECTION' | 'OBJECT';
};
export const getItem = async (id: number): Promise<Item> => {
  const data = await instance.get(`item/${id}`);
  return data?.data?.data?.item || {};
};
