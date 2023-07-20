/* eslint-disable @typescript-eslint/no-unused-vars */
import { Interface, InterfaceAbi, TransactionResponse } from 'ethers';

export abstract class SwapEntity {
  readonly iface: Interface;
  constructor(readonly address: string, readonly abi: InterfaceAbi) {
    this.iface = new Interface(abi);
  }
  decodeBody(txData: string, value?: bigint) {
    return this.iface.parseTransaction({ data: txData, value });
  }

  getTransactionInfo(txResponse: TransactionResponse) {
    throw new Error('Need to implement method');
  }
}
