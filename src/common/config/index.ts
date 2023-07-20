import nodeConfig from 'config';

export interface ITokenConfig {
  address: string;
  priority: number;
  decimals: number;
  symbol: string;
}
export interface IConfig {
  nodeEnv: string;
  node: {
    chainId: number;
    name: string;
    rpcUrl: {
      https: string;
      wss: string;
    };
  };
  uniswapV3: {
    swapRouter: string;
    swapRouter02: string;
    universeRouter: string;
    universeRouterOld: string;
    poolFactoryContactAddress: string;
    quoterContractAddress: string;
  };
  wallet: { address: string; secret: string };
  tokens: Record<'usdt' | 'usdc' | 'weth' | 'dai', ITokenConfig>;
}
export const config: IConfig = {
  nodeEnv: nodeConfig.get('nodeEnv'),
  node: nodeConfig.get('node'),
  uniswapV3: nodeConfig.get('uniswapV3'),
  tokens: nodeConfig.get('tokens'),
  wallet: nodeConfig.get('wallet'),
};
