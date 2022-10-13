   const { time } = require('console');
   const hexToBinary = require("hex-to-binary")
const {GENESIS_DATA, MINE_RATE} = require('./config');
   const cryptoHash = require('./crypto-hash')

   class Block {

      constructor({timestamp, prevHash, hash, data, nonce, difficulty}){

        this.timestamp = timestamp;
        this.prevHash = prevHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty; 
      }

      static genesis (){

        return new this(GENESIS_DATA)
      }

      static mineBlock ({prevBlock, data}){

        let hash, timestamp;
        const  prevHash = prevBlock.hash;
        let {difficulty} = prevBlock;
        let nonce =0;
        do{
          nonce++;
          timestamp = Date.now()
          difficulty =Block.adjustDifficulty({
            originalBlock :prevBlock,
            timestamp
          })
          hash = cryptoHash(timestamp, prevHash, data, nonce, difficulty)
        }while(hexToBinary(hash).substring(0, difficulty)!= '0'.repeat(difficulty))
        return new this ({
         timestamp, prevHash, data, nonce, difficulty, hash

        })
      }
      static adjustDifficulty ({originalBlock, timestamp}){
       
        let {difficulty} = originalBlock;
        if (difficulty <1) return 1;
        const difference = timestamp - originalBlock.timestamp;
        if (difference > MINE_RATE) return difficulty-1;
         return difficulty+1;

      }
   }

   const block1 = new Block({
    hash:"0xacb",
    prevHash :"0xc12",
    timestamp :"10/10/22",
    data : "hello"
   })

   

//    console.log(block1)  // genesis block

//    const genesisBlock = Block.genesis();

//    const mineBlock1 = Block.mineBlock({prevBlock:block1, data:"block2"})

//    console.log(mineBlock1)
//    console.log(genesisBlock)
module.exports = Block;