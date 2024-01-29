import BN from 'bn.js';
import { useImmerAtom } from 'jotai-immer';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { buyAtom } from '../atoms/buyAtom';
import { MarketPlaceContract } from '../base/contract/marketPlaceContract';
import { OwnContract } from '../base/contract/ownContract';
import { BSC_SEND_GAS_FEE } from '../env';
import { delay, divide10Exp } from '../utils';
import { useChainBalance } from './useChainBalance';
import { useModal } from './useModal';
import { useRelayFee } from './useRelayFee';
import { useStatus } from './useStatus';

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

  const { relayFee } = useRelayFee();
  const [buys, setBuys] = useImmerAtom(buyAtom);

  const state = useModal();

  const navigator = useNavigate();

  const buy = useCallback(
    async (groupId: number) => {
      if (status === 1) {
        const totalFee = new BN(price, 10).add(new BN(relayFee, 10));
        const n = Number(divide10Exp(totalFee, 18));

        const count = 180;
        if (BscBalanceVal >= n) {
          let tmp = {};
          try {
            await MarketPlaceContract().methods.buy(groupId, address).send({
              from: address,
              value: totalFee,
              gasPrice: BSC_SEND_GAS_FEE,
            });

            const t = new Array(count).fill(1);

            let success = false;
            for (const {} of t) {
              const hasOwn = Number(
                await OwnContract(false)
                  .methods.balanceOf(address, Number(groupId))
                  .call(),
              );
              if (hasOwn > 0) {
                success = true;
                break;
              }
              await delay(1);
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
    [status, price, relayFee, BscBalanceVal, state, address],
  );
  return { buy, relayFee };
};
