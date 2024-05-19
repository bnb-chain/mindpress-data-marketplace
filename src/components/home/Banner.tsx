import styled from '@emotion/styled';
import { Box, Flex } from '@totejs/uikit';
import Search from '../Search';
import { useGetCatoriesMap } from '../../hooks/apis/useGetCatoriesMap';
import { MPLink } from '../ui/MPLink';
import { SearchIcon } from '@totejs/icons';

export const Banner = () => {
  const { data: cates } = useGetCatoriesMap();

  return (
    <Container>
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

        <Box w="800px" mt="40px" ml="auto" mr="auto">
          <Search width="800px" />

          {cates && (
            <Flex
              mt="24px"
              color="#FFF"
              fontSize="14px"
              fontWeight="800"
              gap="12px"
              alignItems="center"
              justifyContent="center"
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
                    <Box as="span" ml="4px">
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
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)),
    url(https://picsum.photos/1800/600) no-repeat center center;
  background-size: cover;
`;

const BigImageBg = styled(Box)``;

const Title = styled(Box)`
  font-size: 48px;
  font-weight: 900;
  line-height: 56px;
  padding-top: 80px;
  color: #f7f7f8;
  text-align: center;
`;

const Desc = styled(Box)`
  font-size: 20px;
  font-weight: 500;
  color: #fff;
  text-align: center;
  margin-top: 12px;
`;
