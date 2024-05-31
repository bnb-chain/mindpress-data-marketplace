import styled from '@emotion/styled';
import { Box, Flex } from '@totejs/uikit';
import { NET_ENV } from '../../env';
import { ColoredWarningIcon } from '@totejs/icons';

export const InsufficientBSC = () => {
  return (
    <Flex
      fontSize="12px"
      alignItems="center"
      gap="5px"
      fontWeight={600}
      color="#ff6058"
    >
      <ColoredWarningIcon size="sm" color="#ff6058" mr="4px" />
      <BalanceWarn>
        <Box as="span">Insufficient Balance on BSC. </Box>
        {NET_ENV === 'TESTNET' && (
          <Box as="span">
            Get test token from{' '}
            <a
              style={{
                textDecoration: 'underline',
              }}
              href="https://www.bnbchain.org/en/testnet-faucet"
            >
              faucet
            </a>
            .
          </Box>
        )}
      </BalanceWarn>
    </Flex>
  );
};

const BalanceWarn = styled(Box)`
  font-size: 12px;
  line-height: 18px;
`;
