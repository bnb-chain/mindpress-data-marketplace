import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { MarketplaceAbi } from '../../base/contract/marketplace.abi';
import { NEW_MARKETPLACE_CONTRACT_ADDRESS } from '../../env';

export const useBuy = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const doBuy = async (groupId: bigint) => {
    if (!address) return;

    const { request } = await publicClient.simulateContract({
      account: address,
      abi: MarketplaceAbi,
      address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
      functionName: 'buy',
      args: [groupId, address],
    });

    const hash = await walletClient?.writeContract(request);
    console.log('hash', hash);

    if (hash) {
      await publicClient.waitForTransactionReceipt({
        hash,
      });
    }
  };

  return {
    doBuy,
  };
};
