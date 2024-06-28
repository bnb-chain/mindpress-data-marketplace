import styled from '@emotion/styled';
import { LinkArrowIcon } from '@totejs/icons';
import { Box, Flex, Grid, Image, Stack, Text, VStack } from '@totejs/uikit';
import { useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Address, useAccount } from 'wagmi';
import { uploadObjcetAtom } from '../../atoms/uploadObjectAtom';
import { GF_EXPLORER_URL } from '../../env';
import { useSelectEndpoint } from '../../hooks/apis/useSelectEndpoint';
import { useDelist } from '../../hooks/seller/useDelist';
import { useGetBucketByName } from '../../hooks/useGetBucketOrObj';
import { useGetObjInBucketListStatus } from '../../hooks/useGetObjInBucketListStatus';
import { contentTypeToExtension } from '../../utils';
import { getItemByObjectId } from '../../utils/apis';
import { THUMB, getSpaceName } from '../../utils/space';
import { DownloadButton } from '../DownloadButton';
import { Loader } from '../Loader';
import { UploadImage } from '../svgIcon/UploadImage';
import { MPLink } from '../ui/MPLink';
import { YellowButton } from '../ui/buttons/YellowButton';
import DefaultImage from '../ui/default-image';
import { EmptyUpload } from './EmptyUpload';

export const UPLOAD_LIST_PAGE_SIZE = 10;

interface ICollectionList {
  address: Address;
}
const MyCollectionList = ({ address }: ICollectionList) => {
  const navigator = useNavigate();
  const { data: endpoint } = useSelectEndpoint();
  const bucketName = getSpaceName(address);
  const { confirmDelist } = useDelist({
    onSuccess: async () => {
      await refetchList();
    },
  });
  const { address: loginAddress } = useAccount();
  // const [activeObjectName, setActiveObjectName] = useState<string | null>(null);

  const {
    data: listData,
    isLoading: isListDataLoading,
    refetch: refetchList,
  } = useGetObjInBucketListStatus(bucketName, UPLOAD_LIST_PAGE_SIZE);

  const { data: bucketInfo } = useGetBucketByName(bucketName);

  const setUpobjs = useSetAtom(uploadObjcetAtom);

  const handleOpenUploadModal = () => {
    setUpobjs((draft) => {
      draft.openModal = true;
    });
  };

  const isOwner = useMemo(() => {
    return address === loginAddress;
  }, [address, loginAddress]);

  if (isListDataLoading) {
    return <Loader />;
  }

  // console.log('listData', listData);

  return (
    <Container>
      {listData && listData?.objsData.length !== 0 ? (
        <Grid templateColumns="repeat(3, 1fr)" gap="24px">
          <UploadImageCard onClick={handleOpenUploadModal} as="button">
            <UploadImage />
            <Text fontSize="16px" fontWeight="700" color="readable.disabled">
              Upload Image
            </Text>
          </UploadImageCard>

          {listData?.objsData &&
            listData?.listIndex &&
            listData?.objsData.map((item) => {
              const imageUrl = `${endpoint}/view/${bucketName}/${THUMB}/${item.ObjectInfo.ObjectName}`;
              const listed = listData.listIndex.includes(item.ObjectInfo.Id);

              return (
                <Card
                  key={item.ObjectInfo.Id}
                  onMouseEnter={() => {
                    // setActiveObjectName(item.ObjectInfo.ObjectName);
                  }}
                >
                  <ImageBox
                    cursor={'pointer'}
                    onClick={async () => {
                      if (listed) {
                        const { groupId } = await getItemByObjectId(
                          item.ObjectInfo.Id.toString(),
                        );
                        navigator(`/resource?gid=${groupId}`);
                      } else {
                        navigator(
                          `/detail?bid=${bucketInfo?.bucketInfo?.id}&oid=${item.ObjectInfo.Id}`,
                        );
                      }
                    }}
                  >
                    <Image
                      fallbackSrc={DefaultImage}
                      src={imageUrl}
                      alt={imageUrl}
                    />

                    {isOwner && (
                      <VStack className="layer" justifyContent="center">
                        <DownloadButton
                          objectId={String(item.ObjectInfo.Id)}
                          // bucketName={bucketName}
                          // objectName={activeObjectName || ''}
                        />
                      </VStack>
                    )}
                  </ImageBox>
                  <Info>
                    <InfoItem>
                      <Field>Image ID: {item.ObjectInfo.Id}</Field>
                      <Value>
                        <MPLink
                          color="#C4C5CB"
                          // _hover={{
                          //   color: '#C4C5CB',
                          // }}
                          textDecoration="underline"
                          target="_blank"
                          to={`${GF_EXPLORER_URL}object/0x${Number(
                            item.ObjectInfo.Id,
                          )
                            .toString(16)
                            .padStart(64, '0')}`}
                        >
                          GreenfieldScan
                          <LinkArrowIcon w="16px" verticalAlign="middle" />
                        </MPLink>
                      </Value>
                    </InfoItem>
                    <InfoItem>
                      <Field>Media Type:</Field>
                      <Value>
                        {contentTypeToExtension('', item.ObjectInfo.ObjectName)}
                      </Value>
                    </InfoItem>

                    {/* Size: {parseFileSize(item.)} */}
                  </Info>

                  {isOwner && (
                    <Box px="20px" my="24px">
                      {listed ? (
                        <YellowButton
                          h="48px"
                          w="100%"
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            const { groupId } = await getItemByObjectId(
                              item.ObjectInfo.Id.toString(),
                            );
                            console.log('groupId', groupId);
                            confirmDelist(BigInt(groupId));
                          }}
                        >
                          Delist
                        </YellowButton>
                      ) : (
                        <YellowButton
                          h="48px"
                          w="100%"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigator(
                              `/detail?bid=${bucketInfo?.bucketInfo?.id}&oid=${item.ObjectInfo.Id}`,
                            );
                          }}
                        >
                          List
                        </YellowButton>
                      )}
                    </Box>
                  )}
                </Card>
              );
            })}
        </Grid>
      ) : (
        <EmptyUpload />
      )}

      {/* <ModalHolder modal={Tips} handler={modalHandler} /> */}
      {/* <LoadMoreContainer>
        <LoadMore
          // disabled={!loadMore}
          onClick={() => {
            // loadMore?.();
            // setNextToken(listData?.nextPageToken || '');
          }}
        >
          Load More
        </LoadMore>
      </LoadMoreContainer> */}
    </Container>
  );
};

export default MyCollectionList;

const Container = styled.div`
  width: 1200px;
  position: relative;
  padding-bottom: 150px;
`;

const Card = styled(Stack)`
  background-color: #1e2026;
  border-radius: 16px;
  overflow: hidden;
  gap: 24px;
  padding-bottom: 16px;
  /* cursor: pointer; */
`;

const UploadImageCard = styled(Stack)`
  min-height: 382px;
  background-color: #1e2026;
  border-radius: 16px;
  overflow: hidden;
  padding: 16px;
  align-items: center;
  justify-content: center;
  border: 1px dashed #5c5f6a;
`;

const Info = styled(Stack)`
  padding: 0 24px;
`;

const InfoItem = styled(Flex)`
  justify-content: space-between;
  align-items: center;
`;

const Field = styled(Box)`
  color: #8c8f9b;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
`;

const Value = styled(Box)`
  color: #c4c5cb;
  font-size: 14px;
`;

const ImageBox = styled(Box)`
  position: relative;
  width: 384px;
  height: 216px;
  /* aspect-ratio: 1 / 1; */

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .layer {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  &:hover .layer {
    display: flex;
    background: radial-gradient(
      50% 50% at 50% 50%,
      rgba(0, 0, 0, 0.24) 0%,
      rgba(0, 0, 0, 0.6) 100%
    );
  }
`;
