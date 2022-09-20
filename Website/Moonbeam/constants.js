export const IPFS_GATEWAY_BASE_URL = 'https://2eff.lukso.dev/ipfs/'; // TODO: the gateway should be without /ipfs/
export const INTERFACE_IDS = {
    LSP7DigitalAsset: '0xe33f65c3',
    LSP8IdentifiableDigitalAsset: '0x49399145',
  };

  
export const COMMON_ABIS = {
    supportsInterface: {
      inputs: [
        {
          internalType: 'bytes4',
          name: 'interfaceId',
          type: 'bytes4',
        },
      ],
      name: 'supportsInterface',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  };
  
  export const CHAIN_IDS = {
    L14: 22,
    L14_HEX: '0x16',
    L16: 2828,
    L16_HEX: '0xb0c',
  };
  
  export const RPC_URLS = {
    L14: 'https://rpc.l14.lukso.network',
    L16: 'https://rpc.l16.lukso.network',
  };
  export const RPC_ENDPOINT = 'https://rpc.l16.lukso.network'
  