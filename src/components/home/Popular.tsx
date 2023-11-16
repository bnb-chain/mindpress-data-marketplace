import { Box } from '@totejs/uikit';
import { BN } from 'bn.js';
import { useGetCatoriesMap } from '../../hooks/useGetCatoriesMap';
import { useGetItemList } from '../../hooks/useGetItemList';
import { defaultImg, divide10Exp } from '../../utils';
import { Loader } from '../Loader';
import { Sliders } from '../ui/sliders';

const PAGE_SIZE = 10;

export const Popular = () => {
  const { data: itemData, isLoading } = useGetItemList({
    filter: {
      address: '',
      keyword: '',
    },
    offset: 0,
    limit: PAGE_SIZE,
    sort: 'TOTAL_SALE_DESC',
  });

  // const { data: categories } = useGetCatoriesMap();

  if (isLoading || !itemData) {
    return <Loader />;
  }

  const data = itemData.items.map((item) => {
    return {
      id: item.id,
      imgUrl: item.url || defaultImg(item.name, 300),
      name: item.name,
      categoryId: item.categoryId,
      address: item.ownerAddress,
      volumn: String(item.totalSale) || '0',
      price: divide10Exp(new BN(item.price, 10), 18),
    };
  });

  return (
    <Box mt="34px">
      <Sliders data={data} />
    </Box>
  );
};
