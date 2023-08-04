/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from '@common/config';
import { Currency, CurrencyAmount, Token, TradeType, Percent } from '@uniswap/sdk-core';
import { computePoolAddress, Pool, Route, SwapQuoter, Trade } from '@uniswap/v3-sdk';
import { JsonRpcProvider, ethers, Wallet, TransactionRequest, AbiCoder } from 'ethers';
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';

import { logger } from '@common/utils';
import { fromReadableAmount } from '../helpers';
import { FEED_AMOUNT } from '../constants';
import { ERC20_ABI } from '../abi';

export const NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88';

interface IPoolInfo {
  token0: string;
  token1: string;
  fee: number;
  tickSpacing: number;
  sqrtPriceX96: bigint;
  liquidity: bigint;
  tick: number;
}

export enum TransactionState {
  Failed = 'Failed',
  New = 'New',
  Rejected = 'Rejected',
  Sending = 'Sending',
  Sent = 'Sent',
}

const {
  uniswapV3: { poolFactoryContactAddress, quoterContractAddress },
  wallet,
} = config;

export class CoreService {
  wallet: Wallet;

  constructor(private provider: JsonRpcProvider) {
    this.wallet = new Wallet(wallet.secret, provider);
  }

  async getPoolInfo(tokenIn: Token, tokenOut: Token): Promise<IPoolInfo> {
    const currentPoolAddress = computePoolAddress({
      factoryAddress: poolFactoryContactAddress,
      tokenA: tokenIn,
      tokenB: tokenOut,
      fee: FEED_AMOUNT,
    });

    const poolContract = new ethers.Contract(currentPoolAddress, IUniswapV3PoolABI.abi, this.provider);

    const [token0, token1, fee, tickSpacing, liquidity, slot0] = await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);

    return {
      token0,
      token1,
      fee,
      tickSpacing,
      liquidity: BigInt(liquidity),
      sqrtPriceX96: BigInt(slot0[0]),
      tick: slot0[1],
    };
  }

  async getOutputQuoteAhead(tokenIn: Token, tokenOut: Token, amountIn: number): Promise<number> {
    const quoterContract = new ethers.Contract(quoterContractAddress, Quoter.abi, this.provider);

    const quotedAmountOut = await quoterContract.quoteExactInputSingle.staticCall(
      tokenIn.address,
      tokenOut.address,
      FEED_AMOUNT,
      fromReadableAmount(amountIn, tokenIn.decimals).toString(),
      0,
    );
    return quotedAmountOut;
  }

  // TODO rewrite qouter
  async getOutputQuote(route: Route<Currency, Currency>, tokenIn: Token, amount: number) {
    const { calldata } = SwapQuoter.quoteCallParameters(
      route,
      CurrencyAmount.fromRawAmount(tokenIn, fromReadableAmount(amount, tokenIn.decimals).toString()),
      TradeType.EXACT_INPUT,
      {
        useQuoterV2: false,
      },
    );

    const quoteCallReturnData = await this.provider.call({
      to: quoterContractAddress,
      data: calldata,
    });

    return new AbiCoder().decode(['uint256'], quoteCallReturnData);
  }

  async getTokenTransferApproval(token: Token, approvalAmount: number): Promise<TransactionState> {
    try {
      const tokenContract: any = new ethers.Contract(token.address, ERC20_ABI, this.provider);

      const transaction = await tokenContract.populateTransaction.approve(
        fromReadableAmount(approvalAmount, token.decimals).toString(),
      );

      return this.sendTransaction({
        ...transaction,
        from: wallet.address,
      });
    } catch (e) {
      return TransactionState.Failed;
    }
  }

  async sendTransaction(transaction: TransactionRequest): Promise<TransactionState> {
    if (transaction.value) {
      transaction.value = BigInt(transaction.value);
    }
    const txRes = await this.wallet.sendTransaction(transaction);

    let receipt = null;

    while (receipt === null) {
      try {
        receipt = await this.provider.getTransactionReceipt(txRes.hash);

        if (receipt === null) {
          continue;
        }
      } catch (e: any) {
        logger.error(e, `Receipt error:`);
        break;
      }
    }

    if (receipt) {
      return TransactionState.Sent;
    } else {
      return TransactionState.Failed;
    }
  }

  async createTrade(tokenIn: Token, tokenOut: Token, amount: any) {
    const poolInfo = await this.getPoolInfo(tokenIn, tokenOut);

    console.log(poolInfo.sqrtPriceX96);

    const pool = new Pool(
      tokenIn,
      tokenOut,
      FEED_AMOUNT,
      poolInfo.sqrtPriceX96.toString(),
      poolInfo.liquidity.toString(),
      +poolInfo.tick.toString(),
    );

    const swapRoute = new Route([pool], tokenIn, tokenOut);

    const amountOut = await this.getOutputQuote(swapRoute, tokenIn, amount);

    const uncheckedTrade = Trade.createUncheckedTrade({
      route: swapRoute,
      inputAmount: CurrencyAmount.fromRawAmount(
        tokenIn,
        fromReadableAmount(amount, tokenIn.decimals).toString(),
      ),
      outputAmount: CurrencyAmount.fromRawAmount(tokenOut, +amountOut),
      tradeType: TradeType.EXACT_INPUT,
    });

    const slippageTolerance = new Percent('5', 1000);
    console.log(slippageTolerance.toFixed());

    return {
      trade: uncheckedTrade,
      amountOutMi: uncheckedTrade.minimumAmountOut(slippageTolerance).toFixed(),
    };
  }
}
