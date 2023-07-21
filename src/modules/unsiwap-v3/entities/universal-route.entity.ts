import { InterfaceAbi, TransactionResponse } from 'ethers';
import { SwapEntity } from './swap.entity';

export type TUniversalRouteCommand = Record<string, { name: string; input: string[]; names: string[] }>;
export class UniversalRoute extends SwapEntity {
  readonly commands: TUniversalRouteCommand = {
    '00': {
      name: 'V3_SWAP_EXACT_IN',
      input: ['address', 'uint256', 'uint256', 'bytes', 'bool'],
      names: ['recipient', 'amountInput', 'amountOutput', 'paths', 'permit'],
    },
    '01': {
      name: 'V3_SWAP_EXACT_OUT',
      input: ['address', 'uint256', 'uint256', 'bytes', 'bool'],
      names: ['recipient', 'amountInput', 'amountOutput', 'paths', 'permit'],
    },
    '0b': {
      name: 'WRAP_ETH',
      input: ['address', 'uint256'],
      names: ['recipient', 'amount'],
    },
    '0c': {
      name: 'UNWRAP_ETH',
      input: ['address', 'uint256'],
      names: ['recipient', 'amount'],
    },
    '08': {
      name: 'V2_SWAP_EXACT_IN',
      input: ['address', 'uint256', 'uint256', 'address[]', 'bool'],
      names: ['recipient', 'amountInput', 'amountOutput', 'tokens', 'permit'],
    },
    '09': {
      name: 'V2_SWAP_EXACT_OUT',
      input: ['address', 'uint256', 'uint256', 'address[]', 'bool'],
      names: ['recipient', 'amountInput', 'amountOutput', 'tokens', 'permit'],
    },
  };

  constructor(address: string, abi: InterfaceAbi) {
    super(address, abi);
  }

  getTransactionInfo(txResponse: TransactionResponse) {
    const data = this.decodeBody(txResponse.data, txResponse.value);
    const decodedInput = this.decodeInput(data?.args[0], data?.args[1]);
    return {
      name: data?.name,
      type: data?.args[0],
      input: decodedInput,
      deadLine: data?.args[2],
      method: data?.name,
      amount: txResponse.value,
      hash: txResponse.hash,
      to: txResponse.to,
      gasPrice: txResponse.gasPrice,
      gasLimit: txResponse.gasLimit,
    };
  }

  private decodeInput(commands: string, input: string[]) {
    const parsedCommands = this.parseCommand(commands);
    const result = parsedCommands.map((command: string, i: number) => {
      const currentCommand = this.commands[command];
      const decodedInput = this.decoder.decode(currentCommand.input, input[i]);
      return decodedInput.reduce(
        (acc, inputItem, i) => ({
          ...acc,
          [currentCommand.names[i]]: inputItem,
        }),
        { name: currentCommand.name },
      );
    });
    return result;
  }

  private parseCommand(command: string) {
    const splitCommands = command.replace('0x', '').split('');
    const commandArr = [];
    for (let i = 1; i < splitCommands.length; i = i + 2) {
      const item = `${splitCommands[i - 1]}${splitCommands[i]}`;
      commandArr.push(item);
    }
    return commandArr;
  }
}
