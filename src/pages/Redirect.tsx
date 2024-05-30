import { Box } from '@totejs/uikit';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader } from '../components/Loader';
import { NoData } from '../components/NoData';
import { useGetItemByGroupId } from '../hooks/apis/useGetItemByGroupId';

export const Redirect = () => {
  const [p] = useSearchParams();
  const groupId = p.get('gid') as string;

  const navigator = useNavigate();
  const { data: itemInfo, isLoading } = useGetItemByGroupId(groupId);

  useEffect(() => {
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
