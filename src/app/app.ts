/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { config } from '@common/config';
import { logger } from '@common/utils';
import { WebSocketProvider } from 'ethers';

const {
  uniswapV3,
  node: { rpcUrl, chainId },
} = config;

export class App {
  constructor(
    private provider: WebSocketProvider = new WebSocketProvider(rpcUrl.wss, chainId),
    private matchAddresses: string[] = [uniswapV3.swapRouter, uniswapV3.swapRouter02],
  ) {}

  async init() {
    const network = await this.provider.getNetwork();
    logger.info('[App] connect to network ' + network.name);
  }

  async run() {
    this.provider.on('pending', this.transactionHandler);
  }

  private transactionHandler = async (txHash: string) => {
    logger.info(`[App] Transaction ${txHash} on pending`);

    const tx = await this.provider.getTransaction(txHash);
    if (!tx || !tx.to || tx.isMined()) return;

    if (this.matchAddresses.includes(tx.to)) {
      logger.info(`Transaction ${tx.hash} can be used on Uniswap V3`);
    }
  };
}
