import styled from '@emotion/styled';
import { useModal as useWalletKitModal } from '@node-real/walletkit';
import { LinkArrowIcon } from '@totejs/icons';
import { Box, Flex, Image, Link, Stack } from '@totejs/uikit';
import { useImmerAtom } from 'jotai-immer';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { useSearchParams } from 'react-router-dom';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';
import { buyAtom } from '../atoms/buyAtom';
import { DownloadButton } from '../components/DownloadButton';
import { Loader } from '../components/Loader';
import { RelatedImage } from '../components/resource/RelatedImage';
import BSCIcon from '../components/svgIcon/BSCIcon';
import { MPLink } from '../components/ui/MPLink';
import { YellowButton } from '../components/ui/buttons/YellowButton';
import DefaultImage from '../components/ui/default-image';
import { GF_EXPLORER_URL } from '../env';
import { useGetCategory } from '../hooks/apis/useGetCatoriesMap';
import { useGetChainListItems } from '../hooks/buyer/useGetChainListItems';
import { useGetBnbUsdtExchangeRate } from '../hooks/price/useGetBnbUsdtExchangeRate';
import { useGetObjectById } from '../hooks/useGetBucketOrObj';
import { useGetRelationWithGroupId } from '../hooks/useGetItemRelationWithAddr';
import { useModal } from '../hooks/useModal';
import {
  contentTypeToExtension,
  formatDateDot,
  parseGroupName,
  trimLongStr,
} from '../utils';
import { getItemByGroupId } from '../utils/apis';
import { NoData } from '../components/NoData';

/**
 * Have been listed page
 *
 * Can be queryed in API
 */
const Resource = () => {
  const [p] = useSearchParams();
  const groupId = p.get('gid') as string;

  const { data: chainItemInfo, isLoading: isChainItemInfo } =
    useGetChainListItems([BigInt(groupId)]);

  const [, setBuy] = useImmerAtom(buyAtom);
  const { address, isConnected, isConnecting } = useAccount();

  const { data: relationRes, refetch: refetchRelation } =
    useGetRelationWithGroupId(
      address,
      groupId,
      chainItemInfo?.creators?.[0] || '',
    );

  const relation = relationRes?.relation || 'UNKNOWN';

  const category = useGetCategory(
    Number(chainItemInfo?.categoryIds?.[0] || 100),
  );

  const modalData = useModal();
  const { onOpen } = useWalletKitModal();

  const { data: usdExchange } = useGetBnbUsdtExchangeRate();

  const { bucketName, name } = parseGroupName(
    chainItemInfo?.groupNames?.[0] || '',
  );

  const { data: object } = useGetObjectById(
    String(chainItemInfo?.objectIds?.[0]),
  );

  const handleGetItemByGroupId = async () => {
    const itemInfo = await getItemByGroupId(groupId);
    return itemInfo;
  };

  if (isChainItemInfo) {
    return <Loader />;
  }

  if (!chainItemInfo) {
    return <NoData />;
  }

  if (!chainItemInfo?.groupNames?.[0] || !object) {
    return <Loader />;
  }

  // console.log('chainItemInfo', chainItemInfo);
  // console.log('object', object);

  return (
    <Container>
      <ResourceInfo>
        <ImageContainer>
          <Image
            src={chainItemInfo?.urls?.[0]}
            fallbackSrc={DefaultImage}
            alt={chainItemInfo?.urls?.[0]}
          />
        </ImageContainer>

        <Info>
          <Stack gap="24px">
            <UserNameContainer
              as={MPLink}
              to={`/profile?address=${chainItemInfo?.creators?.[0]}`}
              gap={8}
              alignItems={'center'}
              justifyContent={'flex-start'}
            >
              <MetaMaskAvatar
                size={40}
                address={chainItemInfo?.creators?.[0] || ''}
              />
              <UserName>
                {trimLongStr(chainItemInfo?.creators?.[0] || '')}
              </UserName>
            </UserNameContainer>

            <Box>
              <ResourceName>{name}</ResourceName>
              <Desc>{chainItemInfo?.descriptions?.[0]}</Desc>
            </Box>

            <Flex gap="8px">
              <Box bg="#373943" borderRadius="40px" color="#C4C5CB" p="4px 8px">
                {category?.name}
              </Box>
            </Flex>

            <Stack gap="10px">
              <Option>
                <Box className="field">Image ID:</Box>
                <Link
                  target="_blank"
                  href={`${GF_EXPLORER_URL}object/0x${Number(
                    object.objectInfo?.id,
                  )
                    .toString(16)
                    .padStart(64, '0')}`}
                >
                  GreenfieldScan
                  <LinkArrowIcon w="16px" verticalAlign="text-top" />
                </Link>
              </Option>
              <Option>
                <Box className="field">Media type:</Box>
                <Box className="value">
                  {contentTypeToExtension(object.objectInfo!.contentType)}
                </Box>
              </Option>
              {/* <Option>
                <Box className="field">Size</Box>
                <Box className="value">
                  {parseFileSize(objectData.objectInfo!.payloadSize.low || 0)}
                </Box>
              </Option> */}
              <Option>
                <Box className="field">Publish date:</Box>
                <Box className="value">
                  {formatDateDot(object.objectInfo!.createAt.toNumber() * 1000)}
                </Box>
              </Option>
            </Stack>
          </Stack>

          <Stack gap="24px">
            <Flex gap="8px" alignItems="center">
              <BSCIcon color="#F0B90B" w={24} h={24} />
              <BNB>{formatEther(chainItemInfo?.priceList?.[0])} BNB</BNB>
              <Dollar>
                $
                {formatEther(
                  BigInt(parseInt(usdExchange)) * chainItemInfo?.priceList?.[0],
                )}
              </Dollar>
            </Flex>

            {(relation === 'NOT_PURCHASE' || relation === 'UNKNOWN') && (
              <YellowButton
                h="48px"
                borderRadius="8px"
                onClick={async () => {
                  if (relation === 'UNKNOWN') {
                    if (!isConnected && !isConnecting) {
                      onOpen();
                    }
                  } else {
                    const itemInfo = await handleGetItemByGroupId();

                    setBuy((draft) => {
                      draft.openDrawer = true;
                      draft.buying = false;
                      draft.buyData = itemInfo;

                      draft.callback = async () => {
                        await refetchRelation();
                      };
                    });
                  }
                }}
              >
                Buy
              </YellowButton>
            )}

            {relation === 'OWNER' && (
              <YellowButton
                isDisabled
                _disabled={{
                  bg: '#F7F7F873',
                  cursor: 'not-allowed',
                  _hover: {
                    bg: '#F7F7F873',
                  },
                }}
                h="48px"
                onClick={async () => {
                  const itemInfo = await handleGetItemByGroupId();

                  modalData.modalDispatch({
                    type: 'OPEN_DELIST',
                    delistData: {
                      groupId: itemInfo.groupId,
                      groupName: itemInfo.groupName,
                      bucket_name: bucketName,
                      create_at: itemInfo.createdAt,
                      owner: itemInfo.ownerAddress,
                    },
                    callBack: () => {
                      // navigator(`/detail?bid=${bucketData.bucketInfo!.id}`);
                    },
                  });
                }}
              >
                Delist (Coming Soon)
              </YellowButton>
            )}

            {relation === 'PURCHASED' && (
              <DownloadButton
                bucketName={bucketName || ''}
                objectName={name || ''}
              />
            )}
          </Stack>
        </Info>
      </ResourceInfo>

      <Box mt="40px">
        <RelatedImage title="Related images" categoryId={category?.id || 100} />
      </Box>
    </Container>
  );
};

export default Resource;

const Container = styled(Box)`
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
`;

const ImageContainer = styled(Box)`
  height: 500px;
  flex: 1;
  background-color: rgba(0, 0, 0, 0.8);

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }
`;

const ResourceInfo = styled(Flex)`
  gap: 24px;
`;

const Info = styled(Flex)`
  /* padding-top: 50px;
  padding-bottom: 50px; */
  flex-direction: column;
  gap: 24px;
  width: 432px;
  justify-content: space-between;
`;

const UserNameContainer = styled(Flex)``;

const UserName = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 38px;
  color: #f7f7f8;
`;

const ResourceName = styled(Box)`
  color: #f7f7f8;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
`;

const Desc = styled(Box)`
  color: #c4c5cb;
  font-size: 14px;
  line-height: 20px;
`;

const Option = styled(Flex)`
  --field-color: #8c8f9b;
  --val-color: #c4c5cb;
  justify-content: space-between;
  font-size: 14px;
  line-height: 16px;

  a {
    text-decoration: underline;
    color: var(--val-color);
  }

  .field {
    color: var(--field-color);
    font-weight: 700;
  }

  .value {
    color: var(--val-color);
  }
`;

const BNB = styled(Box)`
  color: #f7f7f8;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
`;

const Dollar = styled(Box)`
  color: #c4c5cb;
  font-size: 14px;
`;
