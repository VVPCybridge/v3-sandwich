/* eslint-disable @typescript-eslint/no-unused-vars */
import { Interface, InterfaceAbi, TransactionResponse, AbiCoder } from 'ethers';

export abstract class SwapEntity {
  readonly iface: Interface;
  readonly decoder: AbiCoder;
  constructor(readonly address: string, readonly abi: InterfaceAbi) {
    this.iface = new Interface(abi);
    this.decoder = this.iface.getAbiCoder();
  }
  decodeBody(txData: string, value?: bigint) {
    return this.iface.parseTransaction({ data: txData, value });
  }

  getTransactionInfo(txResponse: TransactionResponse) {
    throw new Error('Need to implement method');
  }
}
