/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { WebSocketProvider, JsonRpcProvider, TransactionResponse } from 'ethers';
import { SwapEntity, UniversalRoute, V3Route } from '@modules/unsiwap-v3/entities';
import { V3_ROUTER_ABI, UNIVERSAL_ROUTE_ABI, V3_02_ROUTER_ABI } from '@modules/unsiwap-v3';

import { logger } from '@common/utils';
import { config } from '@common/config';
import { CoreService } from '@modules/unsiwap-v3/services/core.service';
import { DAI_TOKEN, WETH_TOKEN } from '@modules/unsiwap-v3/constants';

const {
  uniswapV3,
  node: { rpcUrl, chainId },
} = config;

export class App {
  readonly matcher: Record<string, SwapEntity>;
  v3CoreService: CoreService;
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

    this.v3CoreService = new CoreService(this.providerHTTPS);
  }

  async calculateTrade() {
    const [tokenIn, tokenOut, amount] = [WETH_TOKEN, DAI_TOKEN, 100];

    const trade = await this.v3CoreService.createTrade(tokenIn, tokenOut, amount);
    console.log('minAmount', trade.amountOutMi);
  }

  async run() {
    this.providerWSS.on('pending', this.trnHandler);
  }

  private trnHandler = async (txHash: string) => {
    const tx = await this.providerHTTPS.getTransaction(txHash);

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
