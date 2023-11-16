import styled from '@emotion/styled';
import { Box } from '@totejs/uikit';
import BN from 'bn.js';
import { useGetItems } from '../../hooks/useGetItems';
import MindPress from '../../images/mindpress.png';
import { defaultImg, divide10Exp } from '../../utils';
import { Loader } from '../Loader';
import { Sliders } from '../ui/sliders';

interface Props {
  itemIds: number[];
}

export const Banner = (props: Props) => {
  const { data, isLoading } = useGetItems(props.itemIds);

  const bannerData = data?.map((item) => {
    return {
      id: item.id,
      imgUrl: item?.url || defaultImg(item.name, 300),
      name: item.name,
      groupName: item.groupName,
      address: item.ownerAddress,
      volumn: String(item.totalSale) || '0',
      price: divide10Exp(new BN(item.price, 10), 18),
      categoryId: item.categoryId,
    };
  });

  return (
    <Box>
      <BannerBox>
        <Box
          pl="32px"
          pr="16px"
          background={`url(${MindPress}) no-repeat right 32px`}
          backgroundSize="600px auto"
        >
          <Title>Sell & Collect Data</Title>
          <Desc mt="16px">in Decentralized Data Marketplace</Desc>
          <Line mt="32px" />
        </Box>

        <Box mt="50px">
          {isLoading && <Loader />}
          {bannerData && <Sliders data={bannerData} />}
        </Box>
      </BannerBox>
    </Box>
  );
};

const BannerBox = styled(Box)`
  /* margin-top: 32px; */
  /* padding: 32px; */
  background: #181a1e;
  border-radius: 32px;
`;

const Title = styled(Box)`
  font-size: 48px;
  font-weight: 600;
  line-height: 56px;
  padding-top: 32px;
  color: #ffe900;
`;

const Line = styled(Box)`
  height: 1px;
  background: #373943;
`;

const Desc = styled(Box)`
  font-size: 32px;
  font-weight: 400;
  color: #fff;
`;
