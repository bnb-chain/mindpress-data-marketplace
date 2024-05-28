import styled from '@emotion/styled';
import { Box, Center } from '@totejs/uikit';

interface Props {
  text: string;
}

export const Empty: React.FC<Props> = ({ text }) => {
  return (
    <Container>
      <Box flexDirection="column" mt="40px" gap="40px">
        <Box color="#F7F7F8" fontSize="32px" fontWeight="800">
          {`We couldn\'t find anything for "`}
          <Box as="span" color="#FFE900">
            {/* {kw || category?.name} */}
            {text}
          </Box>
          {`".`}
        </Box>
        <Center flexDirection="column" gap="24px">
          import NoData from '../images/NoData.svg';
          <Box
            color="#C4C5CB"
            fontSize="16px"
            lineHeight="24px"
            fontWeight="600"
          >
            Try adjusting your search to find what you are looking for.
          </Box>
        </Center>
      </Box>

      {/* <Box mt="40px">
    <RelatedImage
      title="Images you might be interested in"
      categoryId={category?.id || 100}
    />
  </Box> */}
    </Container>
  );
};

const Container = styled(Box)`
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
`;
