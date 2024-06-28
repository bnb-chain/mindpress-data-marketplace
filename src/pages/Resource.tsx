import styled from '@emotion/styled';
import { useModal as useWalletKitModal } from '@node-real/walletkit';
import { LinkArrowIcon } from '@totejs/icons';
import { Box, Button, Flex, Image, Link, Stack } from '@totejs/uikit';
import { useImmerAtom } from 'jotai-immer';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { useSearchParams } from 'react-router-dom';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';
import { buyAtom } from '../atoms/buyAtom';
import { DownloadButton } from '../components/DownloadButton';
import { Loader } from '../components/Loader';
import { NoData } from '../components/NoData';
import BSCIcon from '../components/svgIcon/BSCIcon';
import { MPLink } from '../components/ui/MPLink';
import { YellowButton } from '../components/ui/buttons/YellowButton';
import DefaultImage from '../components/ui/default-image';
import { GF_EXPLORER_URL } from '../env';
import { useGetCategory } from '../hooks/apis/useGetCatoriesMap';
import { useGetItemByObjectIds } from '../hooks/apis/useGetItemByObjectIds';
import { useGetChainListItems } from '../hooks/buyer/useGetChainListItems';
import { useGetBnbUsdtExchangeRate } from '../hooks/price/useGetBnbUsdtExchangeRate';
import { useDelist } from '../hooks/seller/useDelist';
import { useGetObjectById } from '../hooks/useGetBucketOrObj';
import { useGetRelationWithGroupId } from '../hooks/useGetItemRelationWithAddr';
import {
  contentTypeToExtension,
  formatDateDot,
  parseGroupName,
  trimLongStr,
} from '../utils';
import { getItemByGroupId, getItemByObjectId } from '../utils/apis';

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

  const { data: itemInfo, refetch: refetchItem } = useGetItemByObjectIds({
    ids: [Number(chainItemInfo?.objectIds?.[0])],
  });
  const relation = relationRes?.relation || 'UNKNOWN';

  const category = useGetCategory(
    Number(chainItemInfo?.categoryIds?.[0] || 100),
  );

  // useEffect(() => {
  //   async function xx() {
  //     console.log(
  //       'chainItemInfo?.objectIds?.[0]',
  //       chainItemInfo?.objectIds?.[0],
  //     );
  //     if (!chainItemInfo?.objectIds?.[0]) return;

  //     const objRes = await client.object.headObjectById(
  //       String(chainItemInfo?.objectIds?.[0]) || '0',
  //     );
  //     console.log('objRes', objRes);

  //     const oid = objRes.objectInfo?.id;

  //     if (!objRes.objectInfo?.bucketName) return;

  //     const bucketRes = await client.bucket.headBucket(
  //       objRes.objectInfo.bucketName,
  //     );
  //     console.log('bucketRes', bucketRes);

  //     const bid = bucketRes.bucketInfo?.id;
  //   }

  //   xx();
  // }, [chainItemInfo?.objectIds]);

  const { confirmDelist } = useDelist();
  // onSuccess: async (objectId) => {
  //   debugger;
  //   console.log('objectId', objectId);
  //   const objRes = await client.object.headObjectById(String(objectId));
  //   console.log('objRes', objRes);
  //   const oid = objRes.objectInfo?.id;
  //   if (!objRes.objectInfo?.bucketName) return;
  //   const bucketRes = await client.bucket.headBucket(
  //     objRes.objectInfo.bucketName,
  //   );
  //   console.log('bucketRes', bucketRes);
  //   const bid = bucketRes.bucketInfo?.id;
  //   navigator(`detail?bid=${bid}&oid=${oid}`);
  // },

  const { onOpen } = useWalletKitModal();

  const { data: usdExchange } = useGetBnbUsdtExchangeRate();

  const { name } = parseGroupName(chainItemInfo?.groupNames?.[0] || '');

  const { data: object } = useGetObjectById(
    String(chainItemInfo?.objectIds?.[0]),
  );

  // console.log('chainItemInfo', chainItemInfo);
  // console.log('object', object, name);

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
                {usdExchange ? (
                  <Box as="span">
                    {' '}
                    {formatEther(
                      BigInt(parseInt(usdExchange || 0)) *
                        chainItemInfo?.priceList?.[0],
                    )}
                  </Box>
                ) : (
                  '--'
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

            {relation === 'OWNER' && itemInfo?.length !== 0 && (
              <Button
                bg="#5C5F6A"
                color="#F7F7F8"
                _hover={{
                  bg: '#E1E2E5',
                  color: '#181A1E',
                }}
                h="48px"
                onClick={async () => {
                  if (
                    !chainItemInfo ||
                    !chainItemInfo.objectIds ||
                    !chainItemInfo.objectIds?.[0]
                  ) {
                    return;
                  }

                  const { groupId } = await getItemByObjectId(
                    String(chainItemInfo.objectIds?.[0]),
                  );
                  console.log('groupId', groupId);
                  confirmDelist(BigInt(groupId), chainItemInfo.objectIds?.[0]);
                }}
              >
                Delist
              </Button>
            )}

            {relation === 'PURCHASED' && object.objectInfo?.id && (
              <DownloadButton objectId={object.objectInfo.id} />
            )}
          </Stack>
        </Info>
      </ResourceInfo>

      {/* <Box mt="40px">
        <RelatedImage title="Related images" categoryId={category?.id || 100} />
      </Box> */}
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
  font-weight: 500;
  font-size: 16px;
  line-height: 38px;
  color: #f7f7f8;
`;

const ResourceName = styled(Box)`
  color: #f7f7f8;
  font-size: 16px;
  font-weight: 500;
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
    font-weight: 500;
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
