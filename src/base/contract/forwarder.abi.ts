export const ForwarderAbi = [
  {
    type: 'function',
    name: 'aggregate3Value',
    inputs: [
      {
        name: 'calls',
        type: 'tuple[]',
        internalType: 'struct ITrustedForwarder.Call3Value[]',
        components: [
          {
            name: 'target',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'allowFailure',
            type: 'bool',
            internalType: 'bool',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'callData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'returnData',
        type: 'tuple[]',
        internalType: 'struct ITrustedForwarder.Result[]',
        components: [
          {
            name: 'success',
            type: 'bool',
            internalType: 'bool',
          },
          {
            name: 'returnData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'eip712Domain',
    inputs: [],
    outputs: [
      {
        name: 'fields',
        type: 'bytes1',
        internalType: 'bytes1',
      },
      {
        name: 'name',
        type: 'string',
        internalType: 'string',
      },
      {
        name: 'version',
        type: 'string',
        internalType: 'string',
      },
      {
        name: 'chainId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'verifyingContract',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'salt',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'extensions',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'execute',
    inputs: [
      {
        name: 'request',
        type: 'tuple',
        internalType: 'struct ITrustedForwarder.ForwardRequestData',
        components: [
          {
            name: 'from',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'to',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'gas',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint48',
            internalType: 'uint48',
          },
          {
            name: 'data',
            type: 'bytes',
            internalType: 'bytes',
          },
          {
            name: 'signature',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'executeBatch',
    inputs: [
      {
        name: 'requests',
        type: 'tuple[]',
        internalType: 'struct ITrustedForwarder.ForwardRequestData[]',
        components: [
          {
            name: 'from',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'to',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'gas',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint48',
            internalType: 'uint48',
          },
          {
            name: 'data',
            type: 'bytes',
            internalType: 'bytes',
          },
          {
            name: 'signature',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
      {
        name: 'refundReceiver',
        type: 'address',
        internalType: 'address payable',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'verify',
    inputs: [
      {
        name: 'request',
        type: 'tuple',
        internalType: 'struct ITrustedForwarder.ForwardRequestData',
        components: [
          {
            name: 'from',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'to',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'gas',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint48',
            internalType: 'uint48',
          },
          {
            name: 'data',
            type: 'bytes',
            internalType: 'bytes',
          },
          {
            name: 'signature',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
] as const;
