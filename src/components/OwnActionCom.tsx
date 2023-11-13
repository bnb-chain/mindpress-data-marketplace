import { DownloadIcon, GoIcon } from '@totejs/icons';
import { Preview } from '../components/svgIcon/Preview';

import { getRandomSp } from '../utils/gfSDK';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { parseGroupName } from '../utils/';
import styled from '@emotion/styled';
import { Box, Button, Flex } from '@totejs/uikit';
import { useGlobal } from '../hooks/useGlobal';
import { useGetDownloadUrl } from '../hooks/useGetDownloadUrl';

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
  const { data, breadInfo } = obj;
  const { id, groupName, ownerAddress, type, oid, bn, on } = data;

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

  const state = useGlobal();
  const [p] = useSearchParams();

  const [domain, setDomain] = useState('');

  const downloadUrl = useGetDownloadUrl({
    bucketName,
    name,
  });

  const previewUrl = useMemo(() => {
    const str = `${domain}/view/${bucketName}/${name}`;
    return str;
  }, [name, bucketName, domain]);

  useEffect(() => {
    getRandomSp().then((result) => {
      setDomain(result);
    });
  }, []);

  return (
    <ActionCon gap={10}>
      {type === 'OBJECT' && (
        <Button
          h="32px"
          bg="none"
          color="#F1F2F3"
          border="1px solid #F1F2F3"
          fontSize="14px"
          p="8px 16px"
          _hover={{
            background: '#E1E2E5',
            color: '#181A1E',
          }}
          onClick={() => {
            window.open(downloadUrl);
          }}
        >
          <DownloadIcon />
          <Box as="span" ml="8px">
            Download
          </Box>
        </Button>
      )}
      {/* {type === 'OBJECT' && (
        <Preview
          cursor="pointer"
          onClick={async () => {
            window.open(previewUrl);
          }}
        ></Preview>
        // </Copy>
      )} */}
      {/* <GoIcon
        cursor={'pointer'}
        color={'#AEB4BC'}
        onClick={() => {
          let from = '';
          if (breadInfo) {
            const list = state.globalState.breadList;
            const item = {
              path: (breadInfo as any).path,
              name: (breadInfo as any).name,
              query: p.toString(),
            };
            state.globalDispatch({
              type: 'ADD_BREAD',
              item,
            });

            from = encodeURIComponent(JSON.stringify(list.concat([item])));
          }
          const _from = from ? `&from=${from}` : '';
          if (groupName) {
            navigator(
              `/resource?gid=${id}&gn=${groupName}&address=${ownerAddress}&type=collection&tab=dataList${_from}`,
            );
          } else {
            navigator(
              `/resource?oid=${oid}&address=${ownerAddress}&type=collection&tab=dataList${_from}`,
            );
          }
        }}
      /> */}
    </ActionCon>
  );
};

const ActionCon = styled(Flex)``;
