import styled from '@emotion/styled';
import { Box } from '@totejs/uikit';

export const Disclaimer = () => {
  return (
    <Box w="1200px" my="20px" mx="auto" pb="80px">
      <Box fontSize="20px" fontWeight={700} color="#F7F7F8" as="h3" mb="8px">
        Disclaimer
      </Box>
      <Content as="p">
        The MindPress Data Marketplace is a demo dApp on BNB Greenfield that
        shows how to build a data trading platform within BNB Chain ecosystem.
        This website is only live on Testnet for feature demonstration purpose
        and does not constitute a real data marketplace.
      </Content>
      <Content as="p">
        All images on this website are sourced from the internet and are used
        only for illustrative purposes. We do not claim ownership of these
        images; they remain the property of their respective owners. If you
        believe any content on our website infringes on your intellectual
        property rights, please contact us immediately. We will address and
        resolve the issue promptly. Thank you for your understanding.
      </Content>
    </Box>
  );
};

const Content = styled(Box)`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 24px;
  font-weight: 400;
`;
