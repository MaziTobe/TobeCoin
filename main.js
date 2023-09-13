const {BlockChain, Transactions} = require('./blockchain');

let TobeCoin= new BlockChain();
TobeCoin.createTransaction(new Transactions('address1', 'address2',100));
TobeCoin.createTransaction(new Transactions('address2', 'address1',57));

console.log('\n Starting nminer....')
TobeCoin.minePendingTransaction('tobeBank');

console.log('\n Balance of tobeBank wallet is: '+ TobeCoin.getBalanceOfAddress('tobeBank'));
console.log('\n Balance of address1 wallet is: '+ TobeCoin.getBalanceOfAddress('address1'));
console.log('\n Balance of address2 wallet is: '+ TobeCoin.getBalanceOfAddress('address2'));

TobeCoin.createTransaction(new Transactions('address1', 'address2',100));
TobeCoin.createTransaction(new Transactions('address2', 'address1',143));

console.log('\n Starting nminer....')
TobeCoin.minePendingTransaction('tobeBank');

console.log('\n Balance of tobeBank wallet is: '+ TobeCoin.getBalanceOfAddress('tobeBank'));
console.log('\n Balance of address1 wallet is: '+ TobeCoin.getBalanceOfAddress('address1'));
console.log('\n Balance of address2 wallet is: '+ TobeCoin.getBalanceOfAddress('address2'));

console.log('\n Starting nminer....')
TobeCoin.minePendingTransaction('tobeBank');

console.log('\n Balance of tobeBank wallet is: '+ TobeCoin.getBalanceOfAddress('tobeBank'));
console.log('\n Balance of address1 wallet is: '+ TobeCoin.getBalanceOfAddress('address1'));
console.log('\n Balance of address2 wallet is: '+ TobeCoin.getBalanceOfAddress('address2'));