const {BlockChain, Transactions} = require('./blockchain');
const EC= require('elliptic').ec;
const ec= new EC('secp256k1');

const myPrivateKey= ec.keyFromPrivate('cf417d7043dd9a282de39abf52db377394b430ea0420f3c44ac0baec7528425e');
const myWalletAddress= myPrivateKey.getPublic('hex');

let TobeCoin= new BlockChain();
const tx1 = new Transactions(myWalletAddress, 'some use address', 10);
tx1.signTransaction(myPrivateKey)
TobeCoin.addTransaction(tx1);

console.log('\n Starting miner....')
TobeCoin.minePendingTransaction(myWalletAddress);

console.log('\n Wallet balance is: ', TobeCoin.getBalanceOfAddress('address'));