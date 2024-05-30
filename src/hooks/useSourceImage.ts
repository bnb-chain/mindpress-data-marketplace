import { useQuery } from '@tanstack/react-query';
import { client } from '../utils/gfSDK';
import { offchainDataAtom } from '../atoms/offchainDataAtomAtom';
import { useAtomValue } from 'jotai';
import { useAccount } from 'wagmi';

interface Params {
  bucketName?: string;
  objectName?: string;
}

export const useSourceImage = ({ bucketName, objectName }: Params) => {
  const { address } = useAccount();
  const offchainAuth = useAtomValue(offchainDataAtom);

  return useQuery({
    enabled: !!address && !!bucketName && !!objectName,
    queryKey: ['SOURCE_IMAGE', address, bucketName, objectName],
    queryFn: async () => {
      if (!address || !bucketName || !objectName) return '';

      return await client.object.getObjectPreviewUrl(
        {
          bucketName,
          objectName,
          queryMap: {
            view: '1',
            'X-Gnfd-User-Address': address,
            'X-Gnfd-App-Domain': window.location.origin,
            'X-Gnfd-Expiry-Timestamp': '2024-03-12T09:39:22Z',
          },
        },
        {
          type: 'EDDSA',
          address,
          domain: window.location.origin,
          seed: offchainAuth?.seed || '',
        },
      );
    },
    staleTime: Infinity,
  });
};
