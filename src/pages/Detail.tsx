import { Box } from '@totejs/uikit';
import { useResourceInfo } from '../hooks/useResourceInfo';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';

/**
 * Have not been listed
 * Show bucket or object detail info
 */
export const Detail = () => {
  const navigator = useNavigate();
  const [p] = useSearchParams();

  const bucketName = p.get('bn') as string;
  const objectId = p.get('oid') as string;

  // const groupId = p.getAll('gid')[0];
  // const bucketId = p.getAll('bid')[0];
  // const objectId = p.getAll('oid')[0];
  // const ownerAddress = p.getAll('address')[0];
  // const gName = p.getAll('gn')[0];
  // const bGroupName = p.getAll('bgn')[0];

  // const [update, setUpdate] = useState(false);

  // const { loading, baseInfo, noData } = useResourceInfo({
  //   groupId,
  //   bucketId,
  //   objectId,
  //   address: ownerAddress,
  //   groupName: gName,
  //   update,
  // });

  return <Box>tis si detail page</Box>;
};
