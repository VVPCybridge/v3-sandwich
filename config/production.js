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
  },

  sandwich: {
    tokens: {
      '0xdAC17F958D2ee523a2206206994597C13D831ec7': {
        symbol: 'USDT',
        priority: 0,
      },
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': {
        symbol: 'WETH',
        priority: 0,
      },
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': {
        symbol: 'USDC',
        priority: 0,
      },
      '0x6B175474E89094C44Da98b954EedeAC495271d0F': {
        symbol: 'DAI',
        priority: 0,
      },
    },
  },
};
