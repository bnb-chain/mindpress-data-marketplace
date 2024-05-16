// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { MarketPlaceContract } from '../base/contract/marketPlaceContract';
import { getWeb3 } from '../base/contract/getWeb3';

export const useDelist = () => {
  const { address } = useAccount();

  const delist = useCallback(
    async (groupId: string) => {
      const web3 = getWeb3();
      const gasPrice = await web3.eth.getGasPrice();

      return await MarketPlaceContract()
        .methods.delist(groupId)
        .send({ from: address, gasPrice: gasPrice });
    },
    [address],
  );

  return { delist };
};
