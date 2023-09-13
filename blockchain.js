const SHA256= require('crypto-js/sha256');

class Transactions{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress= fromAddress;
        this.toAddress= toAddress;
        this.amount= amount;
    }
}

class Block{
    constructor(timestamp, transactions, previousHash=''){
        this.timestamp= timestamp;
        this.transactions= transactions;
        this.previousHash= previousHash;
        this.hash= this.calculateHash();
        this.nonce= 0;
    }

    calculateHash(){
        return SHA256(this.index+ this.previousHash+ this.timestamp+ JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) != Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log('Mined Block: ' + this.hash);
    }
}


class BlockChain{
    constructor(){
        this.chain= [this.createGenesisBlock()];
        this.difficulty=2;
        this.pendingTransactions= [];
        this.miningReward= 100;
    }

    createGenesisBlock(){
        return new Block("13/09/2023","Genesis Block","0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    minePendingTransaction(miningRewardAddress){
        let block= new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block mined successfully...!');
        this.chain.push(block);

        this.pendingTransactions= [
            new Transactions(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance= 0;

        for(const block of this.chain){
            for(const tranx of block.transactions){
                if(tranx.fromAddress === address){
                    balance -= tranx.amount;
                }

                if(tranx.toAddress === address){
                    balance += tranx.amount;
                }
            }
        }

        return balance;
    }

    isChainValid(){
        for(let i=1; i<this.chain.length; i++){
            const currentBlock= this.chain[i];
            const previousBlock= this.chain[i-1];

            if(currentBlock.hash != currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash != previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

module.exports.BlockChain = BlockChain;
module.exports.Transactions= Transactions;