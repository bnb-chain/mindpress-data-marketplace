import styled from '@emotion/styled';
import { Flex } from '@totejs/uikit';
import _ from 'lodash';
import { useGetCatoriesMap } from '../../hooks/apis/useGetCatoriesMap';
import { Loader } from '../Loader';
import { MPLink } from '../ui/MPLink';

const CATE_ID = [1, 2, 3, 4, 5, 10];
const CATE_IMAGE = [
  'https://nodereal.io/static/ihs/test/7db05d49-509f-42b0-ae13-8af79fe744e5.png',
  'https://nodereal.io/static/ihs/test/ce2dfbe3-a26e-41ab-b0fd-278879de3bca.png',
  'https://nodereal.io/static/ihs/test/3faf283d-98c4-41ff-bc01-28abc97abb68.png',
  'https://nodereal.io/static/ihs/test/8e4f1bbb-59c8-4b1d-ae5f-3d7ee176ce90.png',
  'https://nodereal.io/static/ihs/test/6dc69fc9-a227-450a-a3e1-fda468c0afc9.png',
  'https://nodereal.io/static/ihs/test/7280eafc-7e07-4c9e-8b6f-96355e89bb45.png',
];

export const CateList = () => {
  const { data: cates, isLoading } = useGetCatoriesMap();

  if (isLoading || !cates) {
    return <Loader />;
  }

  console.log('cates', cates);

  return (
    <CateContainer>
      {cates
        .filter((c) => CATE_ID.includes(c.id))
        .map((category, index) => {
          console.log('cate', category);
          const imageUrl = CATE_IMAGE[index];
          return (
            <CateItem
              key={category.id}
              bg={`linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${imageUrl}) center center`}
              bgSize="cover"
              to={`/search?c=${category.id}`}
            >
              {category.name}
            </CateItem>
          );
        })}
    </CateContainer>
  );
};

const CateContainer = styled(Flex)`
  justify-content: space-between;
  gap: 24px;
`;

const CateItem = styled(MPLink)`
  color: #f7f7f8;
  width: 180px;
  height: 180px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  border-radius: 8px;
  word-break: keep-all;

  &:hover {
    color: rgba(247, 247, 248, 0.8);
  }
`;
