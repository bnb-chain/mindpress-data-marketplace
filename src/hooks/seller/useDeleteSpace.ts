import { useEffect, useState } from 'react';
import { formatEther } from 'viem';
import {
  useAccount,
  useNetwork,
  usePublicClient,
  useSwitchNetwork,
  useWalletClient,
} from 'wagmi';
import { BucketHubAbi } from '../../base/contract/bucketHub.abi';
import { CrossChainAbi } from '../../base/contract/crossChain.abi';
import { BSC_CHAIN } from '../../env';
import { client } from '../../utils/gfSDK';
import { getSpaceName } from '../../utils/space';
import { useGetContractAddresses } from './useGetContractAddresses';

interface Params {
  bucketId: bigint;
  onSuccess?: () => Promise<void>;
  onFailure?: () => Promise<void>;
}

export const useDeleteSpace = ({ bucketId, onFailure, onSuccess }: Params) => {
  const [start, setStart] = useState(false);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const isBSCChain = chain?.id === BSC_CHAIN.id;
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [spaceExist, setSpaceExist] = useState<boolean>(false);

  const { data: contracts, isLoading: loadingContract } =
    useGetContractAddresses();

  const doDelete = async () => {
    if (!address) return;
    if (loadingContract || !contracts) return;

    setStart(true);

    if (!isBSCChain) {
      console.log('BSC_CHAIN', BSC_CHAIN);
      await switchNetworkAsync?.(BSC_CHAIN.id);
    }

    try {
      const [realyFee, ackRelayFee] = await publicClient.readContract({
        abi: CrossChainAbi,
        address: contracts.CrossChainAddress,
        functionName: 'getRelayFees',
      });

      const value = realyFee * BigInt(2) + ackRelayFee;
      console.log('fees', realyFee, ackRelayFee);
      console.log('value', value, formatEther(value));
      const { request, result } = await publicClient.simulateContract({
        account: address,
        address: contracts.BucketHubAddress,
        abi: BucketHubAbi,
        functionName: 'deleteBucket',
        args: [bucketId],
        value,
      });
      console.log('request', request);
      console.log('result', result);
      const hash = await walletClient?.writeContract(request);

      if (hash) {
        const tx = await publicClient.waitForTransactionReceipt({
          hash,
        });
        console.log('tx', tx);
      }

      await onSuccess?.();
    } catch (err) {
      console.log(err);
      await onFailure?.();
    } finally {
      setStart(false);
    }
  };

  useEffect(() => {
    const spaceName = getSpaceName(address);

    const hadCreated = async () => {
      try {
        await client.bucket.headBucket(spaceName);
        setSpaceExist(true);
      } catch (e) {
        setSpaceExist(false);
      }
    };

    hadCreated();
  }, [address]);

  return {
    start,
    doDelete,
    spaceExist,
  };
};
