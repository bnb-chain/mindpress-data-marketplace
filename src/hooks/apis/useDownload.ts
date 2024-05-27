import { useAtomValue } from 'jotai';
import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';
import { offchainDataAtom } from '../../atoms/offchainDataAtomAtom';
import { client } from '../../utils/gfSDK';

export const useDownload = ({
  bucketName,
  name,
}: {
  bucketName?: string;
  name: string;
}) => {
  const { address } = useAccount();

  const offchainData = useAtomValue(offchainDataAtom);
  const [isLoading, setIsLoading] = useState(false);

  const doDownload = useCallback(async () => {
    if (!address || !bucketName) return;

    setIsLoading(true);

    await client.object.downloadFile(
      {
        bucketName,
        objectName: name,
      },
      {
        type: 'EDDSA',
        address,
        domain: window.location.origin,
        seed: offchainData?.seed || '',
      },
    );

    setIsLoading(false);
  }, [address, bucketName, name, offchainData?.seed]);

  return {
    doDownload,
    isLoading,
  };
};
