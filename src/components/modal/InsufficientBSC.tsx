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
      <BalanceWarn>Insufficient Balance on BSC.</BalanceWarn>
      {NET_ENV === 'TESTNET' && (
        <Box>
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
    </Flex>
  );
};

const BalanceWarn = styled(Flex)`
  font-style: normal;

  font-size: 12px;
  line-height: 18px;
  /* identical to box height, or 180% */
  bottom: 90px;
`;
