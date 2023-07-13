import nodeConfig from 'config';

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
  };
}
export const config: IConfig = {
  nodeEnv: nodeConfig.get('nodeEnv'),
  node: nodeConfig.get('node'),
  uniswapV3: nodeConfig.get('uniswapV3'),
};
