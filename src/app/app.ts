/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { config } from '@common/config';
import { logger } from '@common/utils';
import { WebSocketProvider, JsonRpcProvider } from 'ethers';

const {
  uniswapV3,
  node: { rpcUrl, chainId },
} = config;

export class App {
  constructor(
    private providerWSS: WebSocketProvider = new WebSocketProvider(rpcUrl.wss, chainId),
    private providerHTTPS: JsonRpcProvider = new JsonRpcProvider(rpcUrl.https, chainId),
    private matchAddresses: string[] = [
      uniswapV3.swapRouter.toLowerCase(),
      uniswapV3.swapRouter02.toLowerCase(),
      uniswapV3.universeRouter.toLowerCase(),
    ],
  ) {}

  async run() {
    this.providerWSS.on('pending', this.transactionHandler);
  }

  private transactionHandler = async (txHash: string) => {
    logger.info(`[App] Transaction ${txHash} on pending`);

    const tx = await this.providerWSS.getTransaction(txHash);
    if (!tx || !tx.to) return;

    if (this.matchAddresses.includes(tx.to.toLowerCase())) {
      logger.info(`Transaction ${tx.hash} can be used on Uniswap V3`);
    }
  };
}
