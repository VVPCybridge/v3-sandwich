/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { WebSocketProvider, JsonRpcProvider, TransactionResponse } from 'ethers';
import { SwapEntity, UniversalRoute, V3Route } from '@modules/unsiwap-v3/entities';
import { V3_ROUTER_ABI, UNIVERSAL_ROUTE_ABI, V3_02_ROUTER_ABI } from '@modules/unsiwap-v3';

import { logger } from '@common/utils';
import { config } from '@common/config';

const {
  uniswapV3,
  node: { rpcUrl, chainId },
} = config;

export class App {
  readonly matcher: Record<string, SwapEntity>;
  constructor(
    private providerWSS: WebSocketProvider = new WebSocketProvider(rpcUrl.wss, chainId),
    private providerHTTPS: JsonRpcProvider = new JsonRpcProvider(rpcUrl.https, chainId),
  ) {
    this.matcher = {
      [uniswapV3.universeRouter.toLowerCase()]: new UniversalRoute(
        uniswapV3.universeRouter,
        UNIVERSAL_ROUTE_ABI,
      ),
      [uniswapV3.universeRouterOld.toLowerCase()]: new UniversalRoute(
        uniswapV3.universeRouterOld,
        UNIVERSAL_ROUTE_ABI,
      ),
      [uniswapV3.swapRouter.toLowerCase()]: new V3Route(uniswapV3.swapRouter, V3_ROUTER_ABI),
      [uniswapV3.swapRouter02.toLowerCase()]: new V3Route(uniswapV3.swapRouter02, V3_02_ROUTER_ABI),
    };
  }

  async run() {
    this.providerWSS.on('pending', this.trnHandler);
  }

  private trnHandler = async (txHash: string) => {
    const tx = await this.providerWSS.getTransaction(txHash);
    if (!tx || !tx.to) return;

    logger.info(`[App] txHash: ${tx?.hash} txTo: ${tx?.to}`);
    const trnInfo = this.getTrnInfo(tx.to, tx);
    if (!trnInfo) return;
    logger.info('[App] found potential trn', trnInfo);
  };

  private getTrnInfo(addressTo: string, txResponse: TransactionResponse) {
    const route = this.matcher[addressTo.toLowerCase()];
    if (!route) return null;
    return route.getTransactionInfo(txResponse);
  }
}
