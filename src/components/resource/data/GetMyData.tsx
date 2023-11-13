import styled from '@emotion/styled';
import { DownloadIcon } from '@totejs/icons';
import { Box, Button, Flex } from '@totejs/uikit';
import { useEffect, useMemo, useState } from 'react';
import { ITEM_RELATION_ADDR } from '../../../hooks/useGetItemRelationWithAddr';
import { Item } from '../../../utils/apis/types';
import { getRandomSp } from '../../../utils/gfSDK';
import { Copy } from '../../Copy';
import { ViewIcon } from '../../svgIcon/ViewIcon';
import { BuyData } from './BuyData';
import { useGetDownloadUrl } from '../../../hooks/useGetDownloadUrl';

interface Props {
  bucketName?: string;
  itemInfo: Item;
  relation: ITEM_RELATION_ADDR;
}

export const GetMyData = (props: Props) => {
  const { itemInfo, bucketName, relation } = props;

  const [domain, setDomain] = useState('');
  // const downloadUrl = useMemo(() => {
  //   const str = `${domain}/download/${bucketName}/${itemInfo.name}`;
  //   return str;
  // }, [domain, bucketName, itemInfo.name]);
  useEffect(() => {
    getRandomSp().then((result) => {
      setDomain(result);
    });
  }, []);

  const downloadUrl = useGetDownloadUrl({
    bucketName,
    name: itemInfo.name,
  });

  const previewUrl = useMemo(() => {
    const str = `${domain}/view/${bucketName}/${itemInfo.name}`;
    return str;
  }, [domain, bucketName, itemInfo.name]);

  const showButtonGroup = useMemo(() => {
    return relation === 'PURCHASED' || relation === 'OWNER';
  }, [relation]);

  return (
    <Box>
      <Flex alignItems="center" justifyContent="space-between">
        <Title>Get my Data</Title>
        {showButtonGroup && (
          <ButtonGroup>
            <Button
              variant="ghost"
              fontWeight={500}
              color="#F7F7F8"
              _hover={{
                color: '#181A1E',
                background: '#E1E2E5',
              }}
              onClick={() => {
                window.open(previewUrl);
              }}
            >
              <ViewIcon />
              <Box as="span" ml="8px">
                View
              </Box>
            </Button>
            <Button
              bg="#F1F2F3"
              color="#181A1E"
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
          </ButtonGroup>
        )}
      </Flex>

      {relation === 'NOT_PURCHASE' && <BuyData itemInfo={itemInfo} />}

      {relation !== 'NOT_PURCHASE' && (
        <>
          <Hr mt="25px" mb="25px" />

          <Links>
            <Box as="p">Download Universal Endpoint</Box>
            <UrlBox>
              <Url flex="1">{downloadUrl}</Url> <Copy value={downloadUrl} />
            </UrlBox>
            <Box>
              All objects can be identified and accessed via a universal path.
              <Box
                as="a"
                href="https://docs.bnbchain.org/greenfield-docs/docs/guide/storage-provider/modules/gateway#universal-endpoint"
              >
                Learn More
              </Box>
            </Box>
          </Links>

          <Links mt="32px">
            <Box as="p">View Universal Endpoint</Box>
            <UrlBox>
              <Url flex="1">{previewUrl}</Url> <Copy value={previewUrl} />
            </UrlBox>
            <Box>
              All objects can be identified and accessed via a universal path.
              <Box
                as="a"
                href="https://docs.bnbchain.org/greenfield-docs/docs/guide/storage-provider/modules/gateway#universal-endpoint"
              >
                Learn More
              </Box>
            </Box>
          </Links>
        </>
      )}
    </Box>
  );
};

const ButtonGroup = styled(Flex)`
  gap: 16px;
`;

const Title = styled(Box)`
  color: #fff;
  font-size: 24px;
`;

const Hr = styled(Box)`
  height: 1px;
  background: #373943;
`;

const Links = styled(Box)`
  p {
    color: #8c8f9b;
    font-size: 14px;
  }
`;

const UrlBox = styled(Flex)`
  width: 580px;
  padding: 12px 16px;
  margin-top: 8px;
  margin-bottom: 8px;
  height: 48px;
  justify-items: center;
  justify-content: space-between;
  font-size: 16px;
  color: #f7f7f8;
  border: 1px solid #5c5f6a;
  border-radius: 8px;
`;

const Url = styled(Box)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
