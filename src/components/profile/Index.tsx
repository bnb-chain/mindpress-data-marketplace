import styled from '@emotion/styled';
import { Button, Flex } from '@totejs/uikit';
import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { NavBar } from '../NavBar';
import MyCollectionList from './MyCollectionList';
import PurchaseList from './PurchaseList';

enum Type {
  Purchased = 'purchased',
  Uploaded = 'uploaded',
}
const navItems = [
  {
    name: 'Purchased Images',
    key: Type.Purchased,
  },
  {
    name: 'Uploaded Images',
    key: Type.Uploaded,
  },
];

interface IProfileList {
  address: string;
}
const ProfileList = (props: IProfileList) => {
  const [p] = useSearchParams();
  const tab = p.getAll('tab')[0];

  const navigator = useNavigate();
  const { address } = props;

  const currentTab = tab ? tab : Type.Purchased;
  const handleTabChange = useCallback(
    (tab: any) => {
      navigator(`/profile?tab=${tab}`);
    },
    [navigator],
  );

  return (
    <Container>
      <NavCon alignItems={'center'}>
        <NavBar
          active={currentTab}
          onChange={handleTabChange}
          items={navItems}
        />
      </NavCon>

      {currentTab === Type.Purchased ? (
        <PurchaseList address={address} />
      ) : (
        <MyCollectionList />
      )}

      {/* {self ? (
        currentTab === Type.Collections ? (
          <MyCollectionList setShowButton={setShowButton}></MyCollectionList>
        ) : (
          <PurchaseList></PurchaseList>
        )
      ) : (
        <OtherListedList
          realAddress={realAddress}
          self={self}
        ></OtherListedList>
      )} */}
    </Container>
  );
};

export default ProfileList;

const Container = styled.div`
  /* width: 1000px; */
`;

const NavCon = styled(Flex)`
  margin-top: 40px;
  margin-bottom: 40px;
`;
