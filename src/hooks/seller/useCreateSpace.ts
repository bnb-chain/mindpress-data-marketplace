import {
  BucketVisibilityType,
  ExecutorMsg,
} from '@bnb-chain/bsc-cross-greenfield-sdk';
import * as ethers from 'ethers';
import { useState } from 'react';
import { Address, formatEther, parseEther, parseGwei } from 'viem';
import {
  useAccount,
  useNetwork,
  usePublicClient,
  useSwitchNetwork,
  useWalletClient,
} from 'wagmi';
import { BucketHubAbi } from '../../base/contract/bucketHub.abi';
import { CrossChainAbi } from '../../base/contract/crossChain.abi';
import { MarketplaceAbi } from '../../base/contract/marketplace.abi';
import { BSC_CHAIN, NEW_MARKETPLACE_CONTRACT_ADDRESS } from '../../env';
import { getSpaceName } from '../../utils/space';
import { useGetContractAddresses } from './useGetContractAddresses';

export type CreateBucketSynPackage = {
  creator: Address;
  name: string;
  visibility: BucketVisibilityType;
  paymentAddress: Address;
  primarySpAddress: Address;
  primarySpApprovalExpiredHeight: bigint;
  primarySpSignature: Address;
  chargedReadQuota: bigint;
  extraData: `0x${string}`;
};

interface Params {
  onSuccess?: () => Promise<void>;
  onFailure?: () => Promise<void>;
}

export const useCreateSpace = ({ onFailure, onSuccess }: Params) => {
  const [start, setStart] = useState(false);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const isBSCChain = chain?.id === BSC_CHAIN.id;
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const { data: contracts, isLoading: loadingContract } =
    useGetContractAddresses();

  const create = async () => {
    if (!address) return;
    if (loadingContract || !contracts) return;

    setStart(true);

    if (!isBSCChain) {
      console.log('BSC_CHAIN', BSC_CHAIN);
      await switchNetworkAsync?.(BSC_CHAIN.id);
    }

    try {
      // 1. grant role for marketplace
      const ROLE_CREATE = ethers.utils.solidityKeccak256(
        ['string'],
        ['ROLE_CREATE'],
      ) as Address;
      console.log('ROLE_CREATE', ROLE_CREATE);

      console.log('contracts.BucketHubAddress', contracts.BucketHubAddress);
      console.log('args', [
        ROLE_CREATE,
        address,
        NEW_MARKETPLACE_CONTRACT_ADDRESS,
      ]);
      const hasRole = await publicClient.readContract({
        abi: BucketHubAbi,
        address: contracts.BucketHubAddress,
        functionName: 'hasRole',
        args: [ROLE_CREATE, address, NEW_MARKETPLACE_CONTRACT_ADDRESS],
      });

      console.log('hasRole', hasRole);

      if (!hasRole) {
        const expireTime = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;

        const { request } = await publicClient.simulateContract({
          account: address,
          address: contracts.BucketHubAddress,
          abi: BucketHubAbi,
          functionName: 'grantRole',
          args: [
            ROLE_CREATE,
            NEW_MARKETPLACE_CONTRACT_ADDRESS,
            BigInt(expireTime),
          ],
        });

        const hash = await walletClient?.writeContract(request);
        console.log('hash', hash);

        if (hash) {
          const tx = await publicClient.waitForTransactionReceipt({
            hash,
          });
          console.log('tx', tx);
        }
      }

      // 2. crate space
      const spaceName = getSpaceName(address);
      const bucketPkg: CreateBucketSynPackage = {
        creator: address,
        name: spaceName,
        visibility: 2, // private
        paymentAddress: NEW_MARKETPLACE_CONTRACT_ADDRESS,
        primarySpAddress: ethers.constants.AddressZero,
        primarySpApprovalExpiredHeight: BigInt(0),
        primarySpSignature: '0x', // TODO if the owner of the bucket is a smart contract, we are not able to get the primarySpSignature
        chargedReadQuota: BigInt(0),
        extraData: '0x',
      };
      console.log('bucketPkg', bucketPkg);

      const dataSetBucketFlowRateLimit =
        ExecutorMsg.getSetBucketFlowRateLimitParams({
          bucketName: spaceName,
          bucketOwner: address,
          operator: address,
          paymentAddress: address,
          flowRateLimit: '10',
        });

      console.log('flowRateLimitParams', dataSetBucketFlowRateLimit);

      // 3. cross
      const [realyFee, ackRelayFee] = await publicClient.readContract({
        abi: CrossChainAbi,
        address: contracts.CrossChainAddress,
        functionName: 'getRelayFees',
      });

      const value = realyFee * BigInt(2) + ackRelayFee;
      console.log('fees', realyFee, ackRelayFee);
      console.log('value', value, formatEther(value));
      // const { request } = await publicClient.simulateContract({
      //   account: address,
      //   address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
      //   abi: MarketplaceAbi,
      //   functionName: 'createSpace',
      //   args: [bucketPkg, dataSetBucketFlowRateLimit[1]],
      //   value,
      // });
      // const hash = await walletClient?.writeContract(request);

      const gas = await publicClient.estimateContractGas({
        account: address,
        abi: MarketplaceAbi,
        functionName: 'createSpace',
        address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
        args: [bucketPkg, dataSetBucketFlowRateLimit[1]],
      });
      console.log('gas', gas);

      const hash = await walletClient?.writeContract({
        address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
        abi: MarketplaceAbi,
        functionName: 'createSpace',
        args: [bucketPkg, dataSetBucketFlowRateLimit[1]],
        account: address,
        value,
        gas: BigInt(2000000),
        gasPrice: parseGwei('10'),
      });
      console.log('hash', hash);

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

  return {
    start,
    doCreateSpace: create,
  };
};
