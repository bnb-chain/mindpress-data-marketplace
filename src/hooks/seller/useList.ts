import {
  ActionType,
  Effect,
  PrincipalType,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/permission/common';
import { Policy } from '@bnb-chain/greenfield-cosmos-types/greenfield/permission/types';
import { ResourceType } from '@bnb-chain/greenfield-cosmos-types/greenfield/resource/types';
import { useEffect, useState } from 'react';
import { Address, toHex } from 'viem';
import {
  useAccount,
  useNetwork,
  usePublicClient,
  useSwitchNetwork,
  useWalletClient,
} from 'wagmi';
import { CrossChainAbi } from '../../base/contract/crossChain.abi';
import { MarketplaceAbi } from '../../base/contract/marketplace.abi';
import { PermissonHubAbi } from '../../base/contract/permissonHub.abi';
import { BSC_CHAIN, NEW_MARKETPLACE_CONTRACT_ADDRESS } from '../../env';
import { generateGroupName } from '../../utils';
import { client } from '../../utils/gfSDK';
import { sleep } from '../../utils/space';
import { useGetContractAddresses } from '../common/useGetContractAddresses';

interface Params {
  data: {
    bucketId: bigint;
    objectId: bigint;
    objectPrice: bigint;
    desc: string;
    categoryId: bigint;
    imageUrl: string;
  };
  onSuccess?: (listHash?: Address) => Promise<void>;
  onFailure?: () => Promise<void>;
}

const callbackGasLimit = BigInt(500000);

export const useList = ({
  data: { bucketId, objectId, desc, objectPrice, imageUrl, categoryId },
  onFailure,
  onSuccess,
}: Params) => {
  const [start, setStart] = useState(false);

  const [totalFee, setTotalFee] = useState<bigint[]>([]);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const isBSCChain = chain?.id === BSC_CHAIN.id;
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const { data: contracts, isLoading: loadingContract } =
    useGetContractAddresses();

  useEffect(() => {
    calcuteFee();

    async function calcuteFee() {
      if (!contracts) return;
      if (chain?.id !== BSC_CHAIN.id) return;

      const [realyFee, ackRelayFee] = await publicClient.readContract({
        abi: CrossChainAbi,
        address: contracts.CrossChainAddress,
        functionName: 'getRelayFees',
      });

      const totalRelayFee = realyFee * BigInt(2) + ackRelayFee;

      const callbackGasPrice = await publicClient.readContract({
        abi: CrossChainAbi,
        address: contracts.CrossChainAddress,
        functionName: 'callbackGasPrice',
      });

      const callbackFee = callbackGasPrice * callbackGasLimit;

      const values = [totalRelayFee + callbackFee, totalRelayFee + callbackFee];

      setTotalFee(values);
    }
  }, [chain?.id, contracts, publicClient]);

  const doList = async () => {
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

      // const totalRelayFee = realyFee * BigInt(2) + ackRelayFee;
      // const callbackGasPrice = await publicClient.readContract({
      //   abi: CrossChainAbi,
      //   address: contracts.CrossChainAddress,
      //   functionName: 'callbackGasPrice',
      // });

      const { bucketInfo } = await client.bucket.headBucketById(
        String(bucketId),
      );
      const { objectInfo } = await client.object.headObjectById(
        String(objectId),
      );

      if (!bucketInfo || !objectInfo) {
        throw new Error('bucket or object not found');
      }

      const groupName = generateGroupName(
        bucketInfo.bucketName,
        objectInfo.objectName,
      );
      console.log('groupName', groupName);
      const callbackGasLimit = await publicClient.readContract({
        abi: MarketplaceAbi,
        address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
        functionName: 'callbackGasLimit',
      });
      console.log('callbackGasLimit', callbackGasLimit);

      const callbackGasPrice = await publicClient.readContract({
        abi: CrossChainAbi,
        address: contracts.CrossChainAddress,
        functionName: 'callbackGasPrice',
      });
      console.log('callbackGasPrice', callbackGasPrice);

      const callbackFee = callbackGasPrice * callbackGasLimit;

      const { request: listRequest } = await publicClient.simulateContract({
        account: address,
        abi: MarketplaceAbi,
        address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
        functionName: 'list',
        args: [groupName, objectPrice, desc, BigInt(categoryId), imageUrl],
        value: realyFee + ackRelayFee + callbackFee,
        gas: BigInt(400000),
      });

      const listHash = await walletClient?.writeContract(listRequest);
      console.log('listHash', listHash);

      if (listHash) {
        const tx = await publicClient.waitForTransactionReceipt({
          hash: listHash,
        });
        console.log('list tx', tx);
      }

      let groupId = BigInt(0);

      while (true) {
        groupId = await publicClient.readContract({
          abi: MarketplaceAbi,
          address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
          functionName: 'getGroupId',
          args: [groupName],
        });
        console.log('groupId', groupId);

        await sleep(5000);

        if (groupId !== BigInt(0)) {
          break;
        }
      }

      const policyDataToBindGroupToObject = Policy.encode({
        id: '0',
        resourceId: String(objectId), // object id
        resourceType: ResourceType.RESOURCE_TYPE_OBJECT,
        statements: [
          {
            effect: Effect.EFFECT_ALLOW,
            actions: [ActionType.ACTION_GET_OBJECT],
            resources: [],
          },
        ],
        principal: {
          type: PrincipalType.PRINCIPAL_TYPE_GNFD_GROUP,
          value: String(groupId),
        },
      }).finish();

      // const callbackDataCreatePolicy = solidityPack(
      //   ['address', 'uint256', 'uint256', 'uint256', 'uint256'],
      //   [address, groupId, bucketId, objectId, objectPrice],
      // ) as Address;

      // const createPolicyData = encodeFunctionData({
      //   abi: PermissonHubAbi,
      //   functionName: 'prepareCreatePolicy',
      //   args: [address, toHex(policyDataToBindGroupToObject)],
      // });

      // console.log('createPolicyData', createPolicyData);
      // const data = [createPolicyData];

      // const values = [totalRelayFee + callbackFee, totalRelayFee + callbackFee];
      // const totalValue = values.reduce((a, b) => a + b);

      const totalValue = totalFee.reduce((a, b) => a + b);
      console.log('totalValue', totalValue);

      const { request: permissonCreatePolicyRequest } =
        await publicClient.simulateContract({
          account: address,
          abi: PermissonHubAbi,
          address: contracts.PermissionHubAddress,
          functionName: 'createPolicy',
          args: [toHex(policyDataToBindGroupToObject)],
          value: realyFee + ackRelayFee,
        });

      const createPolicyHash = await walletClient?.writeContract(
        permissonCreatePolicyRequest,
      );
      console.log('hash', createPolicyHash);

      if (createPolicyHash) {
        const tx = await publicClient.waitForTransactionReceipt({
          hash: createPolicyHash,
        });
        console.log('tx', tx);
      }

      await onSuccess?.(listHash);
    } catch (err) {
      console.log(err);
      await onFailure?.();
    } finally {
      setStart(false);
    }
  };

  return {
    start,
    doList,
    totalFee,
  };
};
