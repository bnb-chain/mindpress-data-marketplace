import { useCallback } from 'react';
import { useModal } from '../../../hooks/useModal';
import { BuyModal } from './BuyModal';

export const BuyIndex = () => {
  const state = useModal();
  const { buying, openBuy } = state.modalState;

  const handleBuyOpen = useCallback(() => {
    state.modalDispatch({ type: 'CLOSE_BUY' });
  }, []);

  return (
    <>
      <BuyModal isOpen={openBuy} handleOpen={handleBuyOpen}></BuyModal>
    </>
  );
};
