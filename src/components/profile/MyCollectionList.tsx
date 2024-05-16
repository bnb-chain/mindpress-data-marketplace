import styled from '@emotion/styled';
import { LinkArrowIcon } from '@totejs/icons';
import {
  Box,
  Flex,
  Grid,
  Image,
  Pagination,
  Stack,
  Text,
  VStack,
} from '@totejs/uikit';
import { useSetAtom } from 'jotai';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadObjcetAtom } from '../../atoms/uploadObjectAtom';
import { GF_EXPLORER_URL } from '../../env';
import { useGetBucketByName } from '../../hooks/useGetBucketOrObj';
import { useGetItemList } from '../../hooks/useGetItemList';
import { useGetObjInBucketListStatus } from '../../hooks/useGetObjInBucketListStatus';
import { contentTypeToExtension } from '../../utils';
import { Loader } from '../Loader';
import { UploadImage } from '../svgIcon/UploadImage';
import { DefaultButton } from '../ui/buttons/DefaultButton';
import { YellowButton } from '../ui/buttons/YellowButton';
import { MPLink } from '../ui/MPLink';
import { useSelectEndpoint } from '../../hooks/useSelectEndpoint';
import { THUMB, getSpaceName } from '../../utils/space';
import { Address, useAccount } from 'wagmi';

// TODO:
const PAGE_SIZE = 12;

interface ICollectionList {
  address: Address;
}
const MyCollectionList = ({ address }: ICollectionList) => {
  const [page, setPage] = useState(1);
  const navigator = useNavigate();

  const { data: endpoint } = useSelectEndpoint();

  const { data, isLoading, error } = useGetItemList(
    {
      filter: {
        address: address,
        keyword: '',
      },
      offset: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      sort: 'CREATION_DESC',
    },
    page,
    PAGE_SIZE,
  );

  const BUCKET_NAME = getSpaceName(address);

  const { data: listData, isLoading: listLoading } =
    useGetObjInBucketListStatus(BUCKET_NAME, 0);

  // console.log('listData', listData);

  const { data: bucketInfo } = useGetBucketByName(BUCKET_NAME);

  const setUpobjs = useSetAtom(uploadObjcetAtom);

  const handleOpenUploadModal = () => {
    setUpobjs((draft) => {
      draft.openModal = true;
    });
  };

  if (isLoading || listLoading) {
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
          listData?.objsData.map((item) => {
            return (
              <Card
                key={item.ObjectInfo.Id}
                onClick={() => {
                  // console.log('item', item);
                  navigator(
                    `/detail?bid=${bucketInfo?.bucketInfo?.id}&oid=${item.ObjectInfo.Id}&path=/`,
                  );
                }}
              >
                <ImageBox>
                  <Image
                    // TODO: bucket name
                    src={`${endpoint}/view/${BUCKET_NAME}/${THUMB}/${item.ObjectInfo.ObjectName}`}
                    fallbackSrc={`https://picsum.photos/seed/${item.ObjectInfo.ObjectName.replaceAll(
                      ' ',
                      '',
                    )}/400/400`}
                    alt={`${endpoint}/view/${BUCKET_NAME}/${item.ObjectInfo.ObjectName}`}
                  />

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
                          `${endpoint}/view/${BUCKET_NAME}/${item.ObjectInfo.ObjectName}`,
                        );
                      }}
                    >
                      Download
                    </DefaultButton>
                  </VStack>
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

                <Box px="20px" my="24px">
                  {listData.listIndex.includes(item.ObjectInfo.Id) ? (
                    <YellowButton
                      h="48px"
                      w="100%"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
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
                          `/detail?bid=${bucketInfo?.bucketInfo?.id}&oid=${item.ObjectInfo.Id}&path=/`,
                        );
                      }}
                    >
                      List
                    </YellowButton>
                  )}
                </Box>
              </Card>
            );
          })}
      </Grid>
      <Flex justifyContent="center" mt="40px" mb="40px">
        <StyledPagination
          current={page}
          pageSize={PAGE_SIZE}
          total={data?.total}
          showQuickJumper={false}
          onChange={(p) => {
            setPage(p);
          }}
        />
      </Flex>
    </Container>
  );
};

export default MyCollectionList;

const Container = styled.div`
  width: 1200px;
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

const StyledPagination = styled(Pagination)`
  .ui-button {
    background: #373943;
    color: #f7f7f8;
    font-size: 14px;
    width: 32px;
    height: 32px;
  }
  .current[data-selected] {
    background: #1e2026;
    color: #8c8f9b;
    cursor: not-allowed;
  }

  .ui-icon-button {
    width: 32px;
    height: 32px;
    color: #f7f7f8;
  }
`;
