import { useModal } from '@node-real/walletkit';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

/**
 * 'HOME': NOT REDIRECTED
 * 'GO_TO_PROFILE': Go To profile page after connect wallet
 */
type Tag = 'DEFAULT' | 'GO_TO_PROFILE';

export function useAppWallet() {
  const navigate = useNavigate();
  const [tag, setTag] = useState<Tag>('DEFAULT');

  const { address } = useAccount({
    onConnect() {
      if (tag === 'DEFAULT') return;

      navigate('/profile?tab=uploaded');
    },
  });

  const { isOpen, onOpen } = useModal();

  return {
    address,
    isOpen,
    onOpen(tag: Tag = 'DEFAULT') {
      setTag(tag);
      onOpen();
    },
  };
}
