/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { InterfaceAbi, TransactionResponse } from 'ethers';
import { SwapEntity } from './swap.entity';
import { logger } from '@common/utils';

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
          input: this.decodeInput(data.args[1]),
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

  private decodeInput(calls: string[]) {
    return calls.map((call) => {
      try {
        const func = call.slice(0, 10);
        const decodedArgs = this.iface.decodeFunctionData(func, call);
        const funcData = this.iface.getFunction(func);
        return {
          name: funcData?.name,
          args: decodedArgs.reduce((acc, val, i) => {
            return {
              ...acc,
              [funcData?.inputs[i].name as string]: val,
            };
          }, {}),
        };
      } catch (ex: any) {
        logger.error(ex, '[V3Router] error decode input  ');
        return;
      }
    });
  }
}
