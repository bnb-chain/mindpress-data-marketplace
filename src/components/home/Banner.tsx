import styled from '@emotion/styled';
import { Box, Flex } from '@totejs/uikit';
import Search from '../search-box';
import { useGetCatoriesMap } from '../../hooks/apis/useGetCatoriesMap';
import { MPLink } from '../ui/MPLink';
import { SearchIcon } from '@totejs/icons';
import _ from 'lodash';

const BANNER_IMAGES = [
  'https://nodereal.io/static/ihs/test/f35b965b-8114-459c-aa5b-d1f5a3327cf2.png',
  'https://nodereal.io/static/ihs/test/5c5772af-4e28-4a21-b165-4dc63cbcc4e2.jpeg',
  'https://nodereal.io/static/ihs/test/af5567b5-7634-401f-ae23-93c4ebe6cf73.jpg',
  'https://nodereal.io/static/ihs/test/722fa237-9ed7-4441-a977-3c587a227c6f.jpg',
  'https://nodereal.io/static/ihs/test/d98d4db3-7a91-4f3f-9c6d-ebe4a405a5a3.jpg',
  'https://nodereal.io/static/ihs/test/45d8705a-1d1e-4d55-ae19-8acfccdaa01c.jpeg',
  'https://nodereal.io/static/ihs/test/646bd949-1aef-48a6-bb1e-180ffa00112f.jpeg',
  'https://nodereal.io/static/ihs/test/9f1d517a-9b86-454e-9d5f-a2d5fe55fed7.jpeg',
];

export const Banner = () => {
  const { data: cates } = useGetCatoriesMap();

  const bgImage = BANNER_IMAGES[_.random(0, BANNER_IMAGES.length - 1)];

  return (
    <Container
      bg={`linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)),
    url('${bgImage}')
      no-repeat`}
      bgSize="cover"
    >
      <BigImageBg>
        <Title>
          Unleash your creativity on{' '}
          <Box as="span" color="#FFE900">
            MindPress
          </Box>
          .
        </Title>
        <Desc mt="6px">
          The leading decentralized marketplace for borderless creativity.
        </Desc>

        <Box w={['70%', '600px', '800px']} mt="40px" ml="auto" mr="auto">
          <Search width="100%" />

          {cates && (
            <Flex
              mt="24px"
              color="#FFF"
              fontSize="14px"
              fontWeight="700"
              gap="12px"
              alignItems="center"
              justifyContent="center"
              flexWrap={['wrap', null, 'nowrap']}
            >
              <Box>Trending:</Box>
              {cates.slice(0, 4).map((category) => {
                return (
                  <MPLink
                    to={`/search?c=${category.id}`}
                    key={category.id}
                    bg="#5C5F6A"
                    p="4px 8px"
                    color="#F7F7F8"
                    borderRadius="4px"
                    _hover={{
                      bgColor: 'rgba(92, 95, 106, 0.89)',
                    }}
                  >
                    <SearchIcon w="16px" h="16px" verticalAlign="sub" />
                    <Box as="span" ml="4px" fontWeight={500}>
                      {category.name}
                    </Box>
                  </MPLink>
                );
              })}
            </Flex>
          )}
        </Box>
      </BigImageBg>
    </Container>
  );
};

const Container = styled(Box)`
  /* margin-top: 112px; */
  padding: 112px;
  width: 100vw;
  height: 510px;
  padding: 80px 0 130px 0;
  /* 1800 * 600 */
  background: ${(props) => props.bg};
  background-size: cover;
`;

const BigImageBg = styled(Box)``;

const Title = styled(Box)`
  font-size: 48px;
  font-weight: 500;
  line-height: 56px;
  padding-top: 80px;
  color: #f7f7f8;
  text-align: center;
`;

const Desc = styled(Box)`
  font-size: 20px;
  font-weight: 400;
  color: #fff;
  text-align: center;
  margin-top: 12px;
`;
