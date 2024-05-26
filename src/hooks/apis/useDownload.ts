import { useAtomValue } from 'jotai';
import { useCallback } from 'react';
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

  return useCallback(async () => {
    // const doDownload = async () => {
    if (!address || !bucketName) return;

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
    // };
  }, [address, bucketName, name, offchainData?.seed]);
};
