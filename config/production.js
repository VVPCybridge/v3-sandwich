const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  node: {
    name: process.env.NODE_NAME || 'mainnet',
    chainId: Number.parseInt(process.env.CHAIN_ID || '1', 10),
    rpcUrl: {
      https: process.env.RPC_URL_HTTPS || 'https://mainnet.infura.io/v3/cbb7f2bdf9de4cd0a1fbe16e7b559617',
      wss: process.env.RPC_URL_WSS || 'wss://mainnet.infura.io/ws/v3/cbb7f2bdf9de4cd0a1fbe16e7b559617',
    },
  },
  uniswapV3: {
    swapRouter: process.env.UNISWAP_V3_ROUTER || '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    swapRouter02: process.env.UNISWAP_V3_ROUTER_02 || '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    universeRouter: process.env.UNISWAP_V3_UNIVERSE_ROUTER || '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
    universeRouterOld: process.env.UNISWAP_V3_UNIVERSE_ROUTER || '0xEf1c6E67703c7BD7107eed8303Fbe6EC2554BF6B',
    poolFactoryContactAddress:
      process.env.UNISWAP_POOL_FACTORY_CONTRACT_ADDRESS || '0x1F98431c8aD98523631AE4a59f267346ea31F984',

    quoterContractAddress:
      process.env.UNISWAP_QUOTER_CONTRACT_ADDRESS || '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
  },

  wallet: {
    address: process.env.WALLET_ADDRESS || '',
    secret: process.env.WALLET_SECRET || '',
  },

  tokens: {
    usdt: {
      symbol: 'USDT',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimals: 6,
      priority: 0,
    },
    weth: {
      symbol: 'WETH',
      decimals: 18,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      priority: 0,
    },
    usdc: {
      symbol: 'USDC',
      decimals: 6,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      priority: 0,
    },
    dai: {
      symbol: 'DAI',
      decimals: 18,
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      priority: 0,
    },
  },
};
