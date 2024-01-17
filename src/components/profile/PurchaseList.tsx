import styled from '@emotion/styled';
import { LinkArrowIcon } from '@totejs/icons';
import {
  Box,
  Flex,
  Grid,
  Image,
  Pagination,
  Stack,
  VStack,
} from '@totejs/uikit';
import { useState } from 'react';
import { GF_EXPLORER_URL } from '../../env';
import { useGetBOInfoFromGroup } from '../../hooks/useGetBucketOrObj';
import { useGetDownloadUrl } from '../../hooks/useGetDownloadUrl';
import { useGetUserPurchasedList } from '../../hooks/useUserPurchased';
import { contentTypeToExtension } from '../../utils';
import { Item } from '../../utils/apis/types';
import { Loader } from '../Loader';
import { MPLink } from '../ui/MPLink';
import { DefaultButton } from '../ui/buttons/DefaultButton';

const PAGE_SIZE = 12;

interface IProps {
  address: string;
}

const PurchaseList = ({ address }: IProps) => {
  const [page, setPage] = useState(1);

  // const { list, loading, total } = useUserPurchased(page, pageSize);
  const { data: list, isLoading } = useGetUserPurchasedList(
    address as string,
    page - 1,
    PAGE_SIZE,
  );
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const storageInfo = useGetBOInfoFromGroup(activeItem?.groupName);
  const downloadUrl = useGetDownloadUrl({
    bucketName: storageInfo?.bucketName,
    name: activeItem?.name || '',
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Container>
      <Grid templateColumns="repeat(3, 1fr)" gap="24px">
        {list &&
          list.purchases.map((purResource) => {
            const { item } = purResource;
            return (
              <Card key={item.id}>
                <ImageBox
                  onMouseEnter={() => {
                    setActiveItem(item);
                  }}
                >
                  <Image
                    src={item.url}
                    fallbackSrc={`https://picsum.photos/seed/${item.name.replaceAll(
                      ' ',
                      '',
                    )}/400/400`}
                  />

                  <VStack className="layer" justifyContent="center">
                    <DefaultButton
                      h="48px"
                      bg="#F1F2F3"
                      color="#181A1E"
                      fontWeight="800"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(downloadUrl);
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
                          item.resourceId,
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
                    <Value>{contentTypeToExtension('', item.groupName)}</Value>
                  </InfoItem>

                  {/* Size: {parseFileSize(item.)} */}
                </Info>
              </Card>
            );
          })}
      </Grid>

      <Flex justifyContent="center" mt="40px" mb="40px">
        <StyledPagination
          current={page}
          pageSize={PAGE_SIZE}
          total={list?.total}
          showQuickJumper={false}
          onChange={(p) => {
            setPage(p);
          }}
        />
      </Flex>
    </Container>
  );
};

export default PurchaseList;

const Container = styled.div`
  width: 1200px;
`;

const Card = styled(Stack)`
  background-color: #1e2026;
  border-radius: 16px;
  overflow: hidden;
  gap: 24px;
  padding-bottom: 16px;
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
