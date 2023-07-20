import { config } from '@common/config';
import { Token } from '@uniswap/sdk-core';
import { FeeAmount } from '@uniswap/v3-sdk';

const {
  tokens: { weth, usdc, usdt, dai },
  node: { chainId },
} = config;
export const WETH_TOKEN = new Token(chainId, weth.address, weth.decimals, weth.symbol);
export const USDC_TOKEN = new Token(chainId, usdc.address, usdc.decimals, usdc.symbol);
export const USDT_TOKEN = new Token(chainId, usdt.address, usdt.decimals, usdt.symbol);
export const DAI_TOKEN = new Token(chainId, dai.address, dai.decimals, dai.symbol);

export const MAX_FEE_PER_GAS = 100000000000;
export const MAX_PRIORITY_FEE_PER_GAS = 100000000000;
export const FEED_AMOUNT = FeeAmount.MEDIUM;
