import styled from '@emotion/styled';
import { Box, Flex, Grid, Image, Stack } from '@totejs/uikit';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useGetUserPurchasedList } from '../../hooks/useUserPurchased';
import { contentTypeToExtension } from '../../utils';
import { Loader } from '../Loader';
import { GF_EXPLORER_URL } from '../../env';
import { LinkArrowIcon } from '@totejs/icons';
import { MPLink } from '../ui/MPLink';

const PAGE_SIZE = 10;

const PurchaseList = () => {
  const { address } = useAccount();
  // const { handlePageChange, page } = usePagination();

  const [page, setPage] = useState(0);

  // const { list, loading, total } = useUserPurchased(page, pageSize);

  const { data: list, isLoading } = useGetUserPurchasedList(
    address as string,
    page,
    PAGE_SIZE,
  );

  const navigator = useNavigate();

  console.log('list', list);

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
                <ImageBox>
                  <Image
                    src={item.url}
                    fallbackSrc={`https://picsum.photos/seed/${item.name.replaceAll(
                      ' ',
                      '',
                    )}/400/400`}
                  />

                  <Box className="layer"></Box>
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
    </Container>
  );
};

export default PurchaseList;

const Container = styled.div`
  padding: '4px 20px';
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
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  &:hover .layer {
    background: radial-gradient(
      50% 50% at 50% 50%,
      rgba(0, 0, 0, 0.24) 0%,
      rgba(0, 0, 0, 0.6) 100%
    );
  }
`;
