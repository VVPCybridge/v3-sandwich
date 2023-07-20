export * from './router-v3.abi';
export * from './router-v3-02.abi';

export const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function transfer(address to, uint amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint amount)',
];

export const WETH_ABI = ['function deposit() payable', 'function withdraw(uint wad) public'];

// UNIVERSAL ROUTE UNISWAP EXECUTE
export const UNIVERSAL_ROUTE_ABI = [
  'function execute(bytes calldata commands, bytes[] calldata inputs, uint256 deadline)',
];
