import { Box } from '@totejs/uikit';
import { Loader } from '../components/Loader';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetItemByGroupId } from '../hooks/useGetItemByGroupId';
import { NoData } from '../components/NoData';
import { useEffect } from 'react';

export const Redirect = () => {
  const [p] = useSearchParams();
  const groupId = p.get('gid') as string;

  const navigator = useNavigate();
  const { data: itemInfo, isLoading } = useGetItemByGroupId(groupId);

  useEffect(() => {
    console.log(itemInfo);
    if (!itemInfo) return;
    navigator(`/resource?id=${itemInfo.id}`, {
      replace: true,
    });
  }, [itemInfo, navigator]);

  if (isLoading) {
    return <Loader />;
  }

  if (!itemInfo) return <NoData />;

  return (
    <Box>
      <Loader />
    </Box>
  );
};
