import { InterfaceAbi, TransactionResponse } from 'ethers';
import { SwapEntity } from './swap.entity';

export class UniversalRoute extends SwapEntity {
  constructor(address: string, abi: InterfaceAbi) {
    super(address, abi);
  }

  getTransactionInfo(txResponse: TransactionResponse) {
    const data = this.decodeBody(txResponse.data, txResponse.value);
    return {
      name: data?.name,
      type: data?.args[0],
      input: data?.args[1],
      deadLine: data?.args[2],
      method: data?.name,
      amount: txResponse.value,
      hash: txResponse.hash,
      to: txResponse.to,
      gasPrice: txResponse.gasPrice,
      gasLimit: txResponse.gasLimit,
    };
  }
}
