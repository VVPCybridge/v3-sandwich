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
  },
};
