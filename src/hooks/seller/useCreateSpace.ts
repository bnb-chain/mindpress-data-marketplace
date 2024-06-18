import {
  BucketVisibilityType,
  ExecutorMsg,
} from '@bnb-chain/bsc-cross-greenfield-sdk';
import { PickVGFStrategy } from '@bnb-chain/greenfield-cosmos-types/greenfield/virtualgroup/common';
import * as ethers from 'ethers';
import { useEffect, useState } from 'react';
import { Address, formatEther, parseEther } from 'viem';
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
import { client, selectSp } from '../../utils/gfSDK';
import { getSpaceName, sleep } from '../../utils/space';
import { useGetContractAddresses } from '../common/useGetContractAddresses';

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
  globalVirtualGroupFamilyId: number;
};

interface Params {
  onSuccess?: () => Promise<void>;
  onFailure?: () => Promise<void>;
}

export const useCreateSpace = ({ onFailure, onSuccess }: Params) => {
  const [start, setStart] = useState(false);
  const [gas, setGas] = useState(BigInt(0));
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const isBSCChain = chain?.id === BSC_CHAIN.id;
  const publicClient = usePublicClient({
    chainId: BSC_CHAIN.id,
  });
  const { data: walletClient } = useWalletClient();
  const [spaceExist, setSpaceExist] = useState<boolean>(false);

  const { data: contracts, isLoading: loadingContract } =
    useGetContractAddresses();

  useEffect(() => {
    async function calcauteFee() {
      if (loadingContract || !contracts) return;

      const [realyFee, ackRelayFee] = await publicClient.readContract({
        abi: CrossChainAbi,
        address: contracts.CrossChainAddress,
        functionName: 'getRelayFees',
      });

      const value =
        realyFee * BigInt(3) + ackRelayFee * BigInt(2) + parseEther('0.1');
      console.log('fees', realyFee, ackRelayFee);
      console.log('value', value, formatEther(value));

      setGas(value);
    }

    calcauteFee();
  }, [contracts, loadingContract, publicClient]);

  const create = async () => {
    if (!address) return;
    if (loadingContract || !contracts) return;

    setStart(true);

    if (!isBSCChain) {
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
      const sp = await selectSp();
      console.log('sp', sp);
      const { globalVirtualGroupFamilyId } =
        await client.virtualGroup.getSpOptimalGlobalVirtualGroupFamily({
          spId: sp.id,
          pickVgfStrategy: PickVGFStrategy.Strategy_Oldest_Create_Time,
        });

      const bucketPkg: CreateBucketSynPackage = {
        creator: address,
        name: spaceName,
        visibility: 2, // private
        paymentAddress: NEW_MARKETPLACE_CONTRACT_ADDRESS,
        primarySpAddress: sp.primarySpAddress as Address,
        primarySpApprovalExpiredHeight: BigInt(0),
        primarySpSignature: '0x', // TODO if the owner of the bucket is a smart contract, we are not able to get the primarySpSignature
        chargedReadQuota: BigInt(10000 * 1024 * 1024),
        extraData: '0x',
        // globalVirtualGroupFamilyId: 1,
        globalVirtualGroupFamilyId,
      };
      console.log('bucketPkg', bucketPkg);

      const dataSetBucketFlowRateLimit =
        ExecutorMsg.getSetBucketFlowRateLimitParams({
          bucketName: spaceName,
          bucketOwner: address,
          operator: NEW_MARKETPLACE_CONTRACT_ADDRESS,
          paymentAddress: NEW_MARKETPLACE_CONTRACT_ADDRESS,
          flowRateLimit: '1000000000000000000',
        });

      console.log('dataSetBucketFlowRateLimit', dataSetBucketFlowRateLimit);
      console.log('gas', gas);

      const { request, result } = await publicClient.simulateContract({
        account: address,
        address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
        abi: MarketplaceAbi,
        functionName: 'createSpace',
        args: [bucketPkg, dataSetBucketFlowRateLimit[1]],
        value: gas,
      });
      console.log('request', request);
      console.log('result', result);
      const hash = await walletClient?.writeContract(request);

      // const gas = await publicClient.estimateContractGas({
      //   account: address,
      //   abi: MarketplaceAbi,
      //   functionName: 'createSpace',
      //   address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
      //   args: [bucketPkg, dataSetBucketFlowRateLimit[1]],
      // });
      // console.log('gas', gas);

      // const hash = await walletClient?.writeContract({
      //   address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
      //   abi: MarketplaceAbi,
      //   functionName: 'createSpace',
      //   args: [bucketPkg, dataSetBucketFlowRateLimit[1]],
      //   account: address,
      //   value,
      //   gas: BigInt(2000000),
      //   gasPrice: parseGwei('10'),
      // });
      // console.log('hash', hash);

      if (hash) {
        const tx = await publicClient.waitForTransactionReceipt({
          hash,
        });
        console.log('tx', tx);
      }

      while (true) {
        let bucketRes;
        try {
          bucketRes = await client.bucket.headBucket(spaceName);
        } catch (e) {
          // ...
        }

        await sleep(5000);
        console.log('bucket res', bucketRes);

        if (bucketRes) {
          setSpaceExist(true);
          break;
        }
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
    doCreateSpace: create,
    spaceExist,
    gas,
  };
};
