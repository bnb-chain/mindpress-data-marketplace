import styled from '@emotion/styled';
import { Box, Flex } from '@totejs/uikit';
import { trimLongStr } from '../../utils';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { Link } from 'react-router-dom';

const USER_ADDRESS_LIST = [
  '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
  '0x25d443ec23e7b9710af637effd2b98ca9c09e887',
  '0x5440b3a302f72eb0167d63334ba0e1276698cd2d',
  '0x901004b8fe76eb465c68d953f9ccc350c0181457',
  '0xace41854f9b1ebc3c54b2559605b4348fa90d5ad',
  '0xc917fc8c92181a84fe107093543897c7c328cc06',
  // '0xace41854f9b1ebc3c54b2559605b4348fa90d50d',
];

export const NotableAuthors = () => {
  return (
    <Box p="48px 32px">
      <Title as="h2" mb="50px">
        Notable Authors
      </Title>

      <Flex wrap="wrap" justifyContent="space-between" gap="24px">
        {USER_ADDRESS_LIST.map((item) => {
          return (
            <Link key={item} to={`/profile?address=${item}`}>
              <UserContainer
                _hover={{
                  background: '#373943',
                }}
              >
                <MetaMaskAvatar size={40} address={item} />
                <Address>{trimLongStr(item)}</Address>
              </UserContainer>
            </Link>
          );
        })}
      </Flex>
    </Box>
  );
};

const Title = styled(Box)`
  color: #fff;
  font-size: 32px;
  font-style: normal;
  font-weight: 600;
`;

const UserContainer = styled(Flex)`
  align-items: center;
  gap: 16px;
  width: 360px;
  padding: 16px;
  border: 1px solid #373943;
  background: #1e2026;
  box-shadow: 0px 16px 48px 0px rgba(0, 0, 0, 0.16);
  border-radius: 20px;
`;

const Address = styled(Box)`
  color: #f7f7f8;
  font-size: 20px;
  font-weight: 600;
`;
