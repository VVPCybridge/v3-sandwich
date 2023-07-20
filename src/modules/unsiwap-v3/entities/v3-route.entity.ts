import { InterfaceAbi, TransactionResponse } from 'ethers';
import { SwapEntity } from './swap.entity';

export class V3Route extends SwapEntity {
  constructor(address: string, abi: InterfaceAbi) {
    super(address, abi);
  }

  getTransactionInfo(txResponse: TransactionResponse) {
    const data = this.decodeBody(txResponse.data, txResponse.value);

    const resultData = {
      name: data?.name,
      type: data?.name,
      method: data?.name,
      amount: txResponse.value,
      hash: txResponse.hash,
      to: txResponse.to,
      gasPrice: txResponse.gasPrice,
      gasLimit: txResponse.gasLimit,
    };

    switch (data?.name) {
      case 'multicall':
        return {
          ...resultData,
          input: data?.args[1],
          deadLine: data?.args[0],
        };

      default:
        return {
          ...resultData,
          input: data?.args,
          method: data?.name,
          amount: txResponse.value,
          hash: txResponse.hash,
          to: txResponse.to,
        };
    }
  }
}
