import styled from '@emotion/styled';
import { Box } from '@totejs/uikit';
import Search from '../Search';

export const Banner = () => {
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
        </Box>
      </BigImageBg>
    </Container>
  );
};

const Container = styled(Box)`
  /* margin-top: 32px; */
  /* padding: 32px; */
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
  font-weight: 600;
  line-height: 56px;
  padding-top: 32px;
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
