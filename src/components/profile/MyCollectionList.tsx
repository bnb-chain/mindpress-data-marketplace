import styled from '@emotion/styled';
import { LinkArrowIcon } from '@totejs/icons';
import { Box, Flex, Grid, Image, Stack, Text, VStack } from '@totejs/uikit';
import { useSetAtom } from 'jotai';
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
import { Loader } from '../Loader';
import { UploadImage } from '../svgIcon/UploadImage';
import { MPLink } from '../ui/MPLink';
import { DefaultButton } from '../ui/buttons/DefaultButton';
import { YellowButton } from '../ui/buttons/YellowButton';
import DefaultImage from '../ui/default-image';
import { useMemo } from 'react';

export const UPLOAD_LIST_PAGE_SIZE = 10;

interface ICollectionList {
  address: Address;
}
const MyCollectionList = ({ address }: ICollectionList) => {
  const navigator = useNavigate();
  const { data: endpoint } = useSelectEndpoint();
  const bucketName = getSpaceName(address);
  const { confirmDelist } = useDelist();
  const { address: loginAddress } = useAccount();

  const { data: listData, isLoading: isListDataLoading } =
    useGetObjInBucketListStatus(bucketName, UPLOAD_LIST_PAGE_SIZE);

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

  return (
    <Container>
      <Grid templateColumns="repeat(3, 1fr)" gap="24px">
        <UploadImageCard onClick={handleOpenUploadModal} as="button">
          <UploadImage />
          <Text fontSize="16px" fontWeight="900" color="readable.disabled">
            Upload Image
          </Text>
        </UploadImageCard>

        {listData?.objsData &&
          listData?.listIndex &&
          listData?.objsData.map((item) => {
            return (
              <Card key={item.ObjectInfo.Id}>
                <ImageBox>
                  <Image
                    src={`${endpoint}/view/${bucketName}/${THUMB}/${item.ObjectInfo.ObjectName}`}
                    fallbackSrc={DefaultImage}
                    alt={`${endpoint}/view/${bucketName}/${THUMB}/${item.ObjectInfo.ObjectName}`}
                  />

                  {isOwner && (
                    <VStack className="layer" justifyContent="center">
                      <DefaultButton
                        h="48px"
                        bg="#F1F2F3"
                        color="#181A1E"
                        fontWeight="800"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: bucket name
                          window.open(
                            `${endpoint}/view/${bucketName}/${item.ObjectInfo.ObjectName}`,
                          );
                        }}
                      >
                        Download
                      </DefaultButton>
                    </VStack>
                  )}
                </ImageBox>
                <Info>
                  <InfoItem>
                    <Field>Object ID:</Field>
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
                    {listData.listIndex.includes(item.ObjectInfo.Id) ? (
                      <YellowButton
                        background="#5C5F6A"
                        h="48px"
                        w="100%"
                        disabled
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          // const { groupId } = await getItemByObjectId(
                          //   item.ObjectInfo.Id.toString(),
                          // );
                          // confirmDelist(BigInt(groupId));
                        }}
                      >
                        Delist(Coming Soon)
                      </YellowButton>
                    ) : (
                      <YellowButton
                        h="48px"
                        w="100%"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigator(
                            `/detail?bid=${bucketInfo?.bucketInfo?.id}&oid=${item.ObjectInfo.Id}&path=/`,
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
  cursor: pointer;
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
  font-weight: 800;
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

// const LoadMoreContainer = styled(VStack)`
//   background: linear-gradient(
//     180deg,
//     rgba(20, 21, 26, 0) 0%,
//     rgba(20, 21, 26, 0.63) 39.06%,
//     #14151a 100%
//   );

//   position: absolute;
//   bottom: 0px;
//   left: 0;
//   right: 0;
//   padding: 100px 0 40px 0;
// `;

// const LoadMore = styled(DefaultButton)`
//   background: #f1f2f3;
//   color: #181a1e;
//   font-size: 16px;
//   font-weight: 600;
//   height: 64px;
//   padding: 20px 24px;
// `;
