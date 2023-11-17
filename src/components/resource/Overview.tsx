import styled from '@emotion/styled';
import { Box, Flex } from '@totejs/uikit';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ITEM_RELATION_ADDR } from '../../hooks/useGetItemRelationWithAddr';
import { Item } from '../../utils/apis/types';
import {
  QueryHeadBucketResponse,
  QueryHeadGroupResponse,
} from '../../utils/gfSDK';
import { NoData } from '../NoData';
import { GetMyData } from './data/GetMyData';

interface IOverView {
  itemInfo: Item;
  relation: ITEM_RELATION_ADDR;
  bucketData?: QueryHeadBucketResponse;
  groupData?: QueryHeadGroupResponse;
}

const Overview = (props: IOverView) => {
  const { itemInfo, relation, bucketData } = props;
  const { description, type } = itemInfo;

  if (!itemInfo) {
    return <NoData />;
  }

  return (
    <Container justifyContent="space-between">
      <Box flex="1">
        <Title as="h2" mb="30px">
          Description
        </Title>
        <DescBox alignItems={'center'} justifyItems={'center'}>
          {description ? (
            <ReactMarkdown children={description} remarkPlugins={[remarkGfm]} />
          ) : (
            'This is a default description.'
          )}
        </DescBox>
      </Box>

      {type == 'OBJECT' && (
        <GetMyDataBox w="600px">
          <GetMyData
            itemInfo={itemInfo}
            bucketName={bucketData?.bucketInfo.bucketName}
            relation={relation}
          />
        </GetMyDataBox>
      )}
    </Container>
  );
};

export default Overview;

const Container = styled(Flex)`
  gap: 120px;
`;

const DescBox = styled(Box)`
  border-radius: 8px;
  // background: rgba(255, 255, 255, 0.19);
`;

const Title = styled(Box)`
  color: #fff;
  font-size: 24px;
  font-weight: 600;
`;

const GetMyDataBox = styled(Box)`
  flex: 1;
`;
