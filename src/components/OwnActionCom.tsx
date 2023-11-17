import { DownloadIcon, GoIcon } from '@totejs/icons';

import styled from '@emotion/styled';
import { Box, Flex } from '@totejs/uikit';
import { useNavigate } from 'react-router-dom';
import { useGetDownloadUrl } from '../hooks/useGetDownloadUrl';
import { parseGroupName } from '../utils/';
import { BlackButton } from './ui/buttons/BlackButton';

interface IOwnActionCom {
  data: {
    id?: number;
    groupName?: string;
    ownerAddress: string;
    type: string;
    oid?: string;
    bn?: string;
    on?: string;
  };
  address?: string;
  breadInfo?: object;
}
export const OwnActionCom = (obj: IOwnActionCom) => {
  const navigator = useNavigate();
  const { data } = obj;
  const { id, groupName, type, oid, bn, on } = data;

  let name = '';
  let bucketName = '';
  if (groupName) {
    const res = parseGroupName(groupName);
    name = res.name;
    bucketName = res.bucketName;
  } else {
    name = on as string;
    bucketName = bn as string;
  }

  const downloadUrl = useGetDownloadUrl({
    bucketName,
    name,
  });

  return (
    <ActionCon gap={10}>
      {(type === 'Data' || type === 'OBJECT') && (
        <BlackButton
          onClick={() => {
            window.open(downloadUrl);
          }}
        >
          <DownloadIcon />
          <Box as="span" ml="8px">
            Download
          </Box>
        </BlackButton>
      )}
      {(type === 'Collection' || type === 'COLLECTION') && (
        <GoIcon
          cursor={'pointer'}
          color={'#AEB4BC'}
          onClick={() => {
            navigator(`/resource?id=${id}`);
          }}
        />
      )}
    </ActionCon>
  );
};

const ActionCon = styled(Flex)``;
