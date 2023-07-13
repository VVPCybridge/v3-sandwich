const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  node: {
    name: process.env.NODE_NAME || 'goerli',
    chainId: Number.parseInt(process.env.CHAIN_ID || '5', 10),
    rpcUrl: {
      https: process.env.RPC_URL_HTTPS || 'https://goerli.infura.io/v3/8b67a62e6eb4454c8abee64ec3c62d30',
      wss: process.env.RPC_URL_WSS || 'wss://goerli.infura.io/ws/v3/8b67a62e6eb4454c8abee64ec3c62d30',
    },
  },
  uniswapV3: {
    swapRouter: process.env.UNISWAP_V3_ROUTER || '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    swapRouter02: process.env.UNISWAP_V3_ROUTER_02 || '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
  },
};
