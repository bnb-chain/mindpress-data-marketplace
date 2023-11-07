import { Box } from '@totejs/uikit';
import { useTrendingList } from '../../hooks/useTrendingList';
import { Sliders } from '../sliders';
import { defaultImg, divide10Exp } from '../../utils';
import { BN } from 'bn.js';

export const Popular = () => {
  const { list, loading } = useTrendingList();
  console.log('list', list);

  if (loading) {
    // ...
  }

  const data = list.map((item: any) => {
    return {
      id: item.id,
      imgUrl: item.url || defaultImg(item.name, 300),
      name: item.name,
      groupName: item.metaData?.groupName,
      address: item.ownerAddress,
      volumn: item.totalVol,
      price: divide10Exp(new BN(item.price, 10), 18),
    };
  });

  return (
    <Box mt="34px">
      <Sliders data={data} />
    </Box>
  );
};
