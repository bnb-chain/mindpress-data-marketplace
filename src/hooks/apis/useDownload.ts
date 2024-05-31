import { useAtomValue } from 'jotai';
import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';
import { offchainDataAtom } from '../../atoms/offchainDataAtomAtom';
import { client } from '../../utils/gfSDK';

export const useDownload = ({ objectId }: { objectId: string }) => {
  const { address } = useAccount();

  const offchainData = useAtomValue(offchainDataAtom);
  const [isLoading, setIsLoading] = useState(false);

  const doDownload = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);

    const { objectInfo } = await client.object.headObjectById(objectId);

    if (!objectInfo?.bucketName) return;

    await client.object.downloadFile(
      {
        bucketName: objectInfo.bucketName,
        objectName: objectInfo.objectName,
      },
      {
        type: 'EDDSA',
        address,
        domain: window.location.origin,
        seed: offchainData?.seed || '',
      },
    );

    setIsLoading(false);
  }, [address, objectId, offchainData?.seed]);

  return {
    doDownload,
    isLoading,
  };
};
