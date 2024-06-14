import {
  ActionType,
  Effect,
  PrincipalType,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/permission/common';
import { Policy } from '@bnb-chain/greenfield-cosmos-types/greenfield/permission/types';
import { ResourceType } from '@bnb-chain/greenfield-cosmos-types/greenfield/resource/types';
import { GRNToString, newGroupGRN } from '@bnb-chain/greenfield-js-sdk';
import { useEffect, useState } from 'react';
import { Address, Hex, encodeFunctionData, toHex } from 'viem';
import {
  useAccount,
  useNetwork,
  usePublicClient,
  useSwitchNetwork,
  useWalletClient,
} from 'wagmi';
import { IListAtom } from '../../atoms/listAtom';
import { CrossChainAbi } from '../../base/contract/crossChain.abi';
import { ForwarderAbi } from '../../base/contract/forwarder.abi';
import { MarketplaceAbi } from '../../base/contract/marketplace.abi';
import { PermissonHubAbi } from '../../base/contract/permissonHub.abi';
import { BSC_CHAIN, NEW_MARKETPLACE_CONTRACT_ADDRESS } from '../../env';
import { generateGroupName } from '../../utils';
import { client } from '../../utils/gfSDK';
import { sleep } from '../../utils/space';
import { useGetContractAddresses } from '../common/useGetContractAddresses';

interface Params {
  data: IListAtom['data'];
  onSuccess?: (groupId: bigint, listHash?: Address) => Promise<void>;
  onFailure?: () => Promise<void>;
}

interface Call {
  target: Address;
  allowFailure: boolean;
  value: bigint;
  callData: Hex;
}

const callbackGasLimit = BigInt(500000);

export const useList = ({
  data: { bucketId, objectId, desc, price, imageUrl, categoryId, name },
  onFailure,
  onSuccess,
}: Params) => {
  const [start, setStart] = useState(false);

  const [totalFee, setTotalFee] = useState<bigint[]>([]);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const isBSCChain = chain?.id === BSC_CHAIN.id;
  const publicClient = usePublicClient({
    chainId: BSC_CHAIN.id,
  });
  const { data: walletClient } = useWalletClient();

  const { data: contracts, isLoading: loadingContract } =
    useGetContractAddresses();

  useEffect(() => {
    calcuteFee();

    async function calcuteFee() {
      if (!contracts) return;
      if (chain?.id !== BSC_CHAIN.id) return;

      console.log('hi, getRelayFees');
      const [realyFee, ackRelayFee] = await publicClient.readContract({
        abi: CrossChainAbi,
        address: contracts.CrossChainAddress,
        functionName: 'getRelayFees',
      });
      console.log('getRelayFees', realyFee);

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
      await switchNetworkAsync?.(BSC_CHAIN.id);
    }

    try {
      const [realyFee, ackRelayFee] = await publicClient.readContract({
        abi: CrossChainAbi,
        address: contracts.CrossChainAddress,
        functionName: 'getRelayFees',
      });

      const { bucketInfo } = await client.bucket.headBucketById(
        String(bucketId),
      );
      const { objectInfo } = await client.object.headObjectById(
        String(objectId),
      );

      if (!bucketInfo || !objectInfo) {
        throw new Error('bucket or object not found');
      }

      const groupName = generateGroupName(bucketInfo.bucketName, name);
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
          // value: String(groupId),
          value: GRNToString(
            newGroupGRN(NEW_MARKETPLACE_CONTRACT_ADDRESS, groupName),
          ),
        },
      }).finish();

      const callbackFee = callbackGasPrice * callbackGasLimit;

      const calls: Call[] = [
        {
          target: NEW_MARKETPLACE_CONTRACT_ADDRESS,
          allowFailure: false,
          value: realyFee + ackRelayFee + callbackFee,
          callData: encodeFunctionData({
            abi: MarketplaceAbi,
            functionName: 'list',
            args: [
              groupName,
              price,
              desc,
              BigInt(categoryId),
              imageUrl,
              objectId,
            ],
          }),
        },
        {
          target: contracts.PermissionHubAddress,
          allowFailure: false,
          value: realyFee + ackRelayFee,
          callData: encodeFunctionData({
            abi: PermissonHubAbi,
            functionName: 'createPolicy',
            args: [toHex(policyDataToBindGroupToObject)],
          }),
        },
      ];

      console.log('calls', calls);

      let totalValue = BigInt(0);
      for (let i = 0; i < calls.length; i++) {
        totalValue += calls[i].value;
      }

      console.log('contracts.ForwarderAddress', contracts.ForwarderAddress);

      const { request } = await publicClient.simulateContract({
        account: address,
        abi: ForwarderAbi,
        address: contracts.ForwarderAddress,
        functionName: 'aggregate3Value',
        args: [calls],
        value: totalValue,
        gas: BigInt(400000),
      });
      const listHash = await walletClient?.writeContract(request);
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

      await onSuccess?.(groupId, listHash);
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
