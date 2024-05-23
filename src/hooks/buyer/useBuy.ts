import { useImmerAtom } from 'jotai-immer';
import { useCallback } from 'react';
import { parseEther } from 'viem';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { buyAtom } from '../../atoms/buyAtom';
import { MarketplaceAbi } from '../../base/contract/marketplace.abi';
import { BSC_CHAIN, NEW_MARKETPLACE_CONTRACT_ADDRESS } from '../../env';
import { sleep } from '../../utils/space';
import { useChainBalance } from '../price/useChainBalance';
import { useRelayFee } from '../price/useRelayFee';
import { useModal } from '../useModal';
import { useStatus } from '../useStatus';

export const useBuy = (
  groupName: string,
  groupOwner: string,
  price: string,
) => {
  // 0 owner
  // 1 purchase
  // 2 Waiting for purchase
  const { address } = useAccount();
  const { BscBalanceVal } = useChainBalance();
  const { status } = useStatus(groupName, groupOwner, address as string);
  const publicClient = usePublicClient({
    chainId: BSC_CHAIN.id,
  });
  const { data: walletClient } = useWalletClient();

  const { relayFee } = useRelayFee();
  // TODO: relayFee = 0
  // const relayFee = 0;

  // console.log('status', status);

  const [buys, setBuys] = useImmerAtom(buyAtom);
  const state = useModal();

  const buy = useCallback(
    async (groupId: number) => {
      if (status === 1) {
        // ethers.BigNumber.from(relayFee);

        // const totalFee = new BN(price, 10).add(new BN(relayFee, 10));
        // const nes = Number(divide10Exp(totalFee, 18));

        const totalFee = BigInt(price) + relayFee;

        // console.log(';------');
        // console.log('relayFee', relayFee);
        // // console.log('price', price, parseEther(price));
        // console.log('BscBalanceVal', parseEther(BscBalanceVal.toString()));
        // console.log('totalFee', totalFee);

        if (!address) return;

        // const count = 180;
        if (parseEther(BscBalanceVal.toString()) >= totalFee) {
          let tmp = {};
          try {
            const { request } = await publicClient.simulateContract({
              account: address,
              address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
              abi: MarketplaceAbi,
              functionName: 'buy',
              args: [BigInt(groupId), address],
              value: totalFee,
            });

            const hash = await walletClient?.writeContract(request);
            console.log('hash', hash);
            if (hash) {
              const tx = await publicClient.waitForTransactionReceipt({
                hash,
              });
              console.log('tx', tx);
            }

            // const t = new Array(count).fill(1);

            let success = false;

            while (true) {
              const res = await publicClient.readContract({
                abi: MarketplaceAbi,
                address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
                functionName: 'getListItem',
                args: [BigInt(groupId), address],
              });

              if (res[0]) {
                success = true;
                break;
              }

              await sleep(5000);
            }

            tmp = {
              variant: 'success',
              description: success ? 'Buy successful' : 'pending',
              type: 'BUY',
              groupId,
              // callBack: () => {
              //   navigator('/profile?tab=purchase');
              // },
            };
          } catch (e: any) {
            tmp = {
              variant: 'error',
              description: e.message ? e.message : 'Buy failed',
            };
          }

          setBuys((draft) => {
            draft.openDrawer = false;
            draft.buying = false;
          });
          state.modalDispatch({
            type: 'OPEN_RESULT',
            result: tmp,
          });

          buys.callback && buys.callback();
        } else {
          return false;
        }
      }
      return false;
    },
    [
      BscBalanceVal,
      address,
      buys,
      price,
      publicClient,
      relayFee,
      setBuys,
      state,
      status,
      walletClient,
    ],
  );

  return { buy, relayFee };
};
