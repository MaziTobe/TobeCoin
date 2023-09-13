const SHA256= require('crypto-js/sha256');
const EC= require('elliptic').ec;
const ec= new EC('secp256k1');

class Transactions{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress= fromAddress;
        this.toAddress= toAddress;
        this.amount= amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex') != this.fromAddress){
            throw new Error('You are not authorized to sign for this wallet!!!');
        }

        const hashTranx= this.calculateHash();
        const signER= signingKey.sign(hashTranx, 'base64');
        this.signature= signER.toDER('hex');
    }

    isValid(){
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature was provided for this transaction!!!');
        }

        const publicKey= ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
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

    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
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

    addTransaction(transaction){
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must include sender and receiver addresses!!!');
        }

        if(!transaction.isValid){
            throw new Error('Cannot add an inavlid transaction to chain!!!');
        }

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

            if(!currentBlock.hasValidTransactions()){
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