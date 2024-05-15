import {
  ActionType,
  Effect,
  PrincipalType,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/permission/common';
import { Policy } from '@bnb-chain/greenfield-cosmos-types/greenfield/permission/types';
import { ResourceType } from '@bnb-chain/greenfield-cosmos-types/greenfield/resource/types';
import { GRNToString, newGroupGRN } from '@bnb-chain/greenfield-js-sdk';
import { solidityPack } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { Address, encodeFunctionData, parseAbi, toHex } from 'viem';
import {
  useAccount,
  useNetwork,
  usePublicClient,
  useSwitchNetwork,
  useWalletClient,
} from 'wagmi';
import { CrossChainAbi } from '../../base/contract/crossChain.abi';
import { GroupHubAbi } from '../../base/contract/groupHub.abi';
import { GroupTokenAbi } from '../../base/contract/groupToken.abi';
import { MarketplaceAbi } from '../../base/contract/marketplace.abi';
import { MultiMessageAbi } from '../../base/contract/multimessage.abi';
import { PermissonHubAbi } from '../../base/contract/permissonHub.abi';
import { BSC_CHAIN, NEW_MARKETPLACE_CONTRACT_ADDRESS } from '../../env';
import { generateGroupName } from '../../utils';
import { useGetContractAddresses } from './useGetContractAddresses';

interface Params {
  data: {
    bucketId: bigint;
    objectId: bigint;
    objectPrice: bigint;
  };
  onSuccess?: () => Promise<void>;
  onFailure?: () => Promise<void>;
}

const callbackGasLimit = BigInt(500000);

export const useList = ({
  data: { bucketId, objectId, objectPrice },
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
  const [isApproved, setIsApproved] = useState(false);

  const { data: contracts, isLoading: loadingContract } =
    useGetContractAddresses();

  // 1. check group nft approved
  useEffect(() => {
    const checkApproved = async () => {
      if (!address) return;
      if (loadingContract || !contracts) return;

      const isApprovedRes = await publicClient.readContract({
        abi: GroupTokenAbi,
        address: contracts.GroupTokenAddress,
        functionName: 'isApprovedForAll',
        args: [address, NEW_MARKETPLACE_CONTRACT_ADDRESS],
      });

      setIsApproved(isApprovedRes);
    };

    checkApproved();
  }, [address, contracts, loadingContract, publicClient]);

  // approve group nft
  const doApprove = async () => {
    if (!address) return;
    if (loadingContract || !contracts) return;

    const { request } = await publicClient.simulateContract({
      account: address,
      address: contracts.GroupTokenAddress,
      abi: GroupTokenAbi,
      functionName: 'setApprovalForAll',
      args: [NEW_MARKETPLACE_CONTRACT_ADDRESS, true],
    });

    const hash = await walletClient?.writeContract(request);
    console.log('approve hash', hash);
    if (hash) {
      const tx = await publicClient.waitForTransactionReceipt({
        hash,
      });
      console.log('tx', tx);
    }
  };

  useEffect(() => {
    calcuteFee();

    async function calcuteFee() {
      if (!contracts) return;
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
  }, [contracts, publicClient]);

  const doList = async () => {
    if (!address) return;
    if (loadingContract || !contracts) return;

    setStart(true);

    if (!isBSCChain) {
      console.log('BSC_CHAIN', BSC_CHAIN);
      await switchNetworkAsync?.(BSC_CHAIN.id);
    }

    try {
      if (!isApproved) {
        await doApprove();
        return;
      }

      // create group
      // const [realyFee, ackRelayFee] = await publicClient.readContract({
      //   abi: CrossChainAbi,
      //   address: contracts.CrossChainAddress,
      //   functionName: 'getRelayFees',
      // });

      // const totalRelayFee = realyFee * BigInt(2) + ackRelayFee;
      // const callbackGasPrice = await publicClient.readContract({
      //   abi: CrossChainAbi,
      //   address: contracts.CrossChainAddress,
      //   functionName: 'callbackGasPrice',
      // });

      const groupId = await publicClient.readContract({
        abi: MarketplaceAbi,
        address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
        functionName: 'getListGroupId',
        args: [address],
      });

      // TODO: group name?
      const groupName = generateGroupName(String(bucketId), String(objectId));
      // const callbackGasLimit = BigInt(500000);
      // const callbackFee = callbackGasPrice * callbackGasLimit;

      const callbackDataCreateGroup = solidityPack(
        ['address'],
        [address],
      ) as Address;

      console.log('NEW_MARKETPLACE_CONTRACT_ADDRESS', {
        appAddress: NEW_MARKETPLACE_CONTRACT_ADDRESS,
        refundAddress: address,
        failureHandleStrategy: 2, // SkipOnFail
        callbackData: callbackDataCreateGroup,
      });

      const createGroupData = encodeFunctionData({
        abi: GroupHubAbi,
        // abi: [
        //   'prepareCreateGroup(address,address,string,uint256,(address,address,uint8,bytes))',
        // ],
        functionName: 'prepareCreateGroup',
        args: [
          address,
          NEW_MARKETPLACE_CONTRACT_ADDRESS,
          // groupName,
          'test-group',
          callbackGasLimit,
          {
            appAddress: NEW_MARKETPLACE_CONTRACT_ADDRESS,
            refundAddress: address,
            failureHandleStrategy: 2, // SkipOnFail
            callbackData: callbackDataCreateGroup,
          },
        ],
      });

      console.log('createGroupData', createGroupData);

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
          value: GRNToString(newGroupGRN(address as string, groupName)),
        },
      }).finish();

      const callbackDataCreatePolicy = solidityPack(
        ['address', 'uint256', 'uint256', 'uint256', 'uint256'],
        [address, groupId, bucketId, objectId, objectPrice],
      ) as Address;

      const createPolicyData = encodeFunctionData({
        abi: PermissonHubAbi,
        functionName: 'prepareCreatePolicy',
        args: [
          address,
          toHex(policyDataToBindGroupToObject),
          {
            appAddress: NEW_MARKETPLACE_CONTRACT_ADDRESS,
            refundAddress: address,
            failureHandleStrategy: 2, // SkipOnFail
            callbackData: callbackDataCreatePolicy,
          },
        ],
      });

      const data = [createGroupData, createPolicyData];

      // const values = [totalRelayFee + callbackFee, totalRelayFee + callbackFee];
      // const totalValue = values.reduce((a, b) => a + b);

      const totalValue = totalFee.reduce((a, b) => a + b);
      console.log('totalValue', totalValue);

      const { request } = await publicClient.simulateContract({
        account: address,
        abi: parseAbi(MultiMessageAbi),
        address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
        functionName: 'sendMessages',
        args: [
          [contracts.GroupHubAddress, contracts.PermissionHubAddress],
          data,
          totalFee,
        ],
        value: totalValue,
      });

      const hash = await walletClient?.writeContract(request);
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
    isApproved,
    start,
    doList,
    totalFee,
  };
};
