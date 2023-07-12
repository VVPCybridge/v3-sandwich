import nodeConfig from 'config';

export interface IConfig {
  nodeEnv: string;
}

export const config: IConfig = {
  nodeEnv: nodeConfig.get('nodeEnv'),
};
