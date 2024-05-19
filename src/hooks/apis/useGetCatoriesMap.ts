import { useQuery } from '@tanstack/react-query';
import { getCategoryMap } from '../../utils/apis';

export const useGetCatoriesMap = () => {
  return useQuery({
    queryKey: ['getCatoriesMap'],
    queryFn: getCategoryMap,
    gcTime: Infinity,
    staleTime: Infinity,
  });
};

export const useGetCategory = (categoryId: number) => {
  const { data: categories } = useGetCatoriesMap();

  if (!categories) {
    return;
  }

  return categories.find((item) => item.id === categoryId);
};
