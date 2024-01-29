import styled from '@emotion/styled';
import { useModal as useWalletKitModal } from '@node-real/walletkit';
import { LinkArrowIcon } from '@totejs/icons';
import { Box, Flex, Image, Link, Stack } from '@totejs/uikit';
import BN from 'bn.js';
import { useImmerAtom } from 'jotai-immer';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { buyAtom } from '../atoms/buyAtom';
import { Loader } from '../components/Loader';
import { RelatedImage } from '../components/resource/RelatedImage';
import BSCIcon from '../components/svgIcon/BSCIcon';
import { MPLink } from '../components/ui/MPLink';
import { DefaultButton } from '../components/ui/buttons/DefaultButton';
import { YellowButton } from '../components/ui/buttons/YellowButton';
import { GF_EXPLORER_URL } from '../env';
import { useBNBPrice } from '../hooks/useBNBPrice';
import {
  useGetBOInfoFromGroup,
  useGetBucketByName,
  useGetObject,
} from '../hooks/useGetBucketOrObj';
import { useGetCategory } from '../hooks/useGetCatoriesMap';
import { useGetDownloadUrl } from '../hooks/useGetDownloadUrl';
import { useGetItemById } from '../hooks/useGetItemById';
import { useGetItemRelationWithAddr } from '../hooks/useGetItemRelationWithAddr';
import { useModal } from '../hooks/useModal';
import {
  contentTypeToExtension,
  divide10Exp,
  formatDateDot,
  parseFileSize,
  roundFun,
  trimLongStr,
} from '../utils';

/**
 * Have been listed
 *
 * Can be queryed in API
 */
const Resource = () => {
  const [p] = useSearchParams();
  const navigator = useNavigate();
  const itemId = p.get('id') as string;
  const { data: itemInfo, isLoading: itemInfoLoading } = useGetItemById(
    parseInt(itemId),
  );
  const { price: bnbPrice } = useBNBPrice();
  const category = useGetCategory(itemInfo?.categoryId || 100);
  const [, setBuy] = useImmerAtom(buyAtom);

  const { address, isConnected, isConnecting } = useAccount();
  const { relation, refetch: refetchRelation } = useGetItemRelationWithAddr(
    address,
    itemInfo,
  );

  const storageInfo = useGetBOInfoFromGroup(itemInfo?.groupName);

  const { data: bucketData } = useGetBucketByName(storageInfo?.bucketName);

  const { data: objectData } = useGetObject(
    storageInfo?.bucketName,
    storageInfo?.objectName,
  );

  const downloadUrl = useGetDownloadUrl({
    bucketName: storageInfo?.bucketName,
    name: itemInfo?.name || '',
  });

  const modalData = useModal();
  const { onOpen } = useWalletKitModal();

  if (itemInfoLoading) {
    return <Loader />;
  }

  if (!itemInfo || !bucketData || !objectData) {
    return <Loader />;
  }

  return (
    <Container>
      <ResourceInfo>
        <ImageContainer>
          <Image
            src={itemInfo.url}
            fallbackSrc={`https://picsum.photos/seed/${itemInfo.id}/400/600`}
          />
        </ImageContainer>

        <Info>
          <Stack gap="24px">
            <UserNameContainer
              as={MPLink}
              to={`/profile?address=${itemInfo.ownerAddress}`}
              gap={8}
              alignItems={'center'}
              justifyContent={'flex-start'}
            >
              <MetaMaskAvatar size={40} address={itemInfo.ownerAddress} />
              <UserName>{trimLongStr(itemInfo.ownerAddress)}</UserName>
            </UserNameContainer>

            <Box>
              <ResourceName>{itemInfo.name}</ResourceName>
              {itemInfo.description && <Desc>{itemInfo.description}</Desc>}
            </Box>

            <Flex gap="8px">
              <Box bg="#373943" borderRadius="40px" color="#C4C5CB" p="4px 8px">
                {category?.name}
              </Box>
            </Flex>

            <Stack gap="10px">
              <Option>
                <Box className="field">Object ID:</Box>
                <Link
                  target="_blank"
                  href={`${GF_EXPLORER_URL}object/0x${Number(
                    objectData?.objectInfo.id,
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
                  {contentTypeToExtension(objectData?.objectInfo.contentType)}
                </Box>
              </Option>
              <Option>
                <Box className="field">Size</Box>
                <Box className="value">
                  {parseFileSize(objectData.objectInfo.payloadSize.low || 0)}
                </Box>
              </Option>
              <Option>
                <Box className="field">Publish date:</Box>
                <Box className="value">
                  {formatDateDot(itemInfo.createdAt * 1000)}
                </Box>
              </Option>
            </Stack>
          </Stack>

          <Stack gap="24px">
            <Flex gap="8px" alignItems="center">
              <BSCIcon color="#F0B90B" w={24} h={24} />
              <BNB>{divide10Exp(new BN(itemInfo.price, 10), 18)} BNB</BNB>
              <Dollar>
                $
                {roundFun(
                  divide10Exp(
                    new BN(itemInfo.price, 10).mul(
                      new BN(Number(bnbPrice), 10),
                    ),
                    18,
                  ).toString(),
                  8,
                )}
              </Dollar>
            </Flex>

            {(relation === 'NOT_PURCHASE' || relation === 'UNKNOWN') && (
              <YellowButton
                h="48px"
                borderRadius="8px"
                onClick={() => {
                  // console.log('relation', relation, isConnecting, isConnected);
                  if (relation === 'UNKNOWN') {
                    if (!isConnected && !isConnecting) {
                      onOpen();
                    }
                  } else {
                    setBuy((draft) => {
                      draft.openDrawer = true;
                      draft.buying = false;
                      draft.buyData = itemInfo;

                      draft.callback = () => {
                        refetchRelation();
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
                h="48px"
                onClick={() => {
                  modalData.modalDispatch({
                    type: 'OPEN_DELIST',
                    delistData: {
                      groupId: itemInfo.groupId,
                      bucket_name: storageInfo?.bucketName,
                      create_at: itemInfo.createdAt,
                      owner: itemInfo.ownerAddress,
                    },
                    callBack: () => {
                      navigator(`/detail?bid=${bucketData.bucketInfo.id}`);
                    },
                  });
                }}
              >
                Delist
              </YellowButton>
            )}

            {relation === 'PURCHASED' && (
              <DefaultButton
                h="48px"
                bg="#F1F2F3"
                color="#181A1E"
                onClick={() => {
                  window.open(downloadUrl);
                }}
              >
                Download
              </DefaultButton>
            )}
          </Stack>
        </Info>
      </ResourceInfo>

      <Box mt="40px">
        <RelatedImage
          title="Related images"
          categoryId={category?.id || 100}
          allUrl={`/search?c=${category?.id}`}
        />
      </Box>
    </Container>
  );
};

export default Resource;

const Container = styled(Box)`
  width: 1400px;
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
