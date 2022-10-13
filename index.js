const bodyparser = require("body-parser")
const express = require("express")
const Blockchain = require("./blockchain")
const PubSub = require("./publishsubscribe")
const request = require("request")
const blockchain = new Blockchain()
const app = express()


const pubsub = new PubSub({blockchain})

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

setTimeout(()=> pubsub.broadcastChain(), 1000)
app.use(bodyparser.json())
app.get("/api/blocks", (req, res)=>{
    res.json(blockchain.chain)
})

app.post("/api/mine", (req, res)=>{
  const {data} = req.body;
  blockchain.addBlock({data});
  pubsub.broadcastChain();
  res.redirect("/api/blocks")
})
 
   const synChains = ()=>{

    request(
      {url:`${ROOT_NODE_ADDRESS}/api/blocks`},
      (error,response, body)=>{
        if (!error && response.statusCode === 200){
          const rootChain = JSON.parse(body);
          console.log("replace chain on sync with", rootChain)
          blockchain.replaceChain(rootChain)
        }
      }
    )
   }
let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true'){
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random()*1000)
}
const PORT = PEER_PORT || DEFAULT_PORT
app.listen(PORT, ()=>{
  console.log  (`listing on port : ${PORT}`)
  synChains()
  
})