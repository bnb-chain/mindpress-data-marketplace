import { Box } from '@totejs/uikit';
import { useTrendingList } from '../../hooks/useTrendingList';

export const Popular = () => {
  const { list, loading } = useTrendingList();
  console.log('list', list);

  return <Box mt="34px">pop</Box>;
};
