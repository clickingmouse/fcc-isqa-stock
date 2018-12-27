/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var mongoose = require('mongoose')
var Schema=mongoose.Schema

var fetch=require('isomorphic-fetch')

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});


mongoose.connect(process.env.DB)
var stockSchema = new Schema({
stock:{type:String, required:true,  unique : true , },
  likes: {type:Array,
          default: []
           }
//  likeBy: String 
})

var Stocks = new mongoose.model("Stocks",stockSchema)
// test data
var testStock = new Stocks({stock:"TICKER", likes:["128.1.1.1", "128.0.0.0"]}) 
//testStock.save(function(err,data){
  //  if(err){console.log(err)}
    //console.log(data) 
   // res.json(data) 
//})

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
    console.log("received new query")
    console.log(req.query)
    var stock = req.query.stock
    console.log(typeof(req.query.like))
    console.log(req.query.like)
    console.log(typeof(stock))
    ///////////////////////////////////////////////////////
    // setting up
    //console.log(req.connection.remoteAddress)
    console.log(req.ip)
    var stockInput
    var likeOption = false
    var stockCount = 1
/*    
    function getStockLikes(stockTicker) {
    console.log("counting likes for "+ stockTicker)
      Stocks.findOneAndUpdate({stock:stockTicker},{stock:stockTicker},{new:true, upsert:true},(err,model)=>{
        if(err){console.log(err)}
        console.log("found likes for "+ stockTicker)
        console.log("like count is: " + model.likes.length)
      console.log(model)
      })
    }
*/
    
    async function getStockLikes(stockTicker) {
    console.log("counting likes for "+ stockTicker)
      const stockdata = await Stocks.findOneAndUpdate({stock:stockTicker},{stock:stockTicker},{new:true, upsert:true})
     //const stockLikeData = await stockdata.json()
     console.log(">>>"+stockTicker)
     console.log(stockdata.likes.length)
      return (stockdata.likes.length)
    }

    
    function likeStock(stockTicker, ipAddr) {
    console.log("++++++++")
    //look for instance and return none 
      ///findoneand update option upserts
      /*
         Stocks.findOne({stock:stockTicker, likes:ipAddr},(err,model)=>{
    if (err){console.log(err)}
      console.log("found")
      console.log(model)
    
    })
    */
    Stocks.findOneAndUpdate({stock:stockTicker},{$addToSet:{likes:ipAddr}},{new:true, upsert:true},(err,model)=>{
    if (err){console.log(err)}
      console.log("upserting")
      console.log(model)
    
    })
    
    }
    
    
    async function getStockPrice(stockTicker){
      var urlEndPoint ="https://api.iextrading.com/1.0"
      var stockTest = "AAPL"
      var url = urlEndPoint +"/stock/" + stockTicker + "/batch?types=quote"
    
     var res = await fetch(url, {
    method:"get"
      //body:JSON.stringify({types:quotes,})
      
    })  
     var stockData = await res.json()
     
     console.log(stockData.quote.latestPrice)
      console.log(typeof(stockData.quote.latestPrice))
      return (stockData.quote.latestPrice)
  //  return (myJson.quote.latestPrice)
    }
    
    
    
    
    
    //tests
    //getStockPrice("AAPL")
    console.log("::")
    console.log("Price is -->>" +getStockPrice("AAPL"))
    //likeStock("TICKER","128.1.1.1")
    //likeStock("TICKER","128.1.1.2")
    //likeStock("TEST","129.0.1.2")
    console.log("likes is -->"+ getStockLikes("TEST"))
    getStockLikes("ABC")
    
 //////////////////////////////////////////////////////////////////////////////////////////////////////////   
    if(req.query.like == 'true'){
    console.log("like selected")
      likeOption = true
      
    } 
    
      // check if like one or two stocks
    
    
    if (typeof(req.query.stock) === 'string'){
    console.log("uno")
    stockCount = 1 
      stockInput = req.query.stock
    } else {
    stockInput = req.query.stock
      console.log("not string")
      console.log(stockInput)
      stockCount = 2
    }
// stockOption
 //   var likeOption = false
 //   var stockCount = 1
    
    async function outputData ( stockInput, stockCount, likeOption){
      console.log(stockInput)
    console.log(stockInput +"||"+ stockCount +"||"+likeOption)
      
     //var something = await getStockPrice(stockInput)
     
    if (stockCount == 1 && likeOption === false ){      
    var returnObj = {
      "stock":stockInput,
      "price":await getStockPrice(stockInput),
//      "likes":await getStockLikes(stockInput)
    }
    }

      
    if (stockCount == 1 && likeOption === true ){
     var returnObj = {
      "stock":stockInput,
      "price":await getStockPrice(stockInput),
      "likes":await getStockLikes(stockInput)
    } 
      
      
    }
      
      if (stockCount == 2 && likeOption === false ){      
      console.log("#")
      var returnObj =[]
      console.log(stockInput[0]+"&"+stockInput[1])
//      stockInput.forEach((stock)=>{
      
        returnObj.push({
        "stock":stockInput[0],
      "price":await getStockPrice(stockInput[0]),
          "rel_likes":await getStockLikes(stockInput[0]) - await getStockLikes(stockInput[1])
        })
      
      returnObj.push({
        "stock":stockInput[1],
      "price":await getStockPrice(stockInput[1]),
        "rel_likes":await getStockLikes(stockInput[1]) - await getStockLikes(stockInput[0])
        })
      
      
    }
      console.log("+++")
      
      if (stockCount == 2 && likeOption === true ){ 
        
            var returnObj =[]
        returnObj.push({
        "stock":stockInput[0],
      "price":await getStockPrice(stockInput[0])
          //"rel_likes"=await getStockLikes(stockInput[0]) -await getStockLikes(stockInput[1])
        })
      
      returnObj.push({
        "stock":stockInput[1],
      "price":await getStockPrice(stockInput[1])
       // "rel_likes"= await getStockLikes(stockInput[1]) -await getStockLikes(stockInput[0])
        }) 
        
      }
      
      
      console.log(returnObj)
      res.json({"stockData":returnObj})
    }
    
outputData(stockInput, stockCount, likeOption )
    
    // single get stock likes
    //
    // save like and get
    //
    //
    //
    
    // test fetch.then////////////////////////////////////////////////////////////////////
    //All endpoints are prefixed with: https://api.iextrading.com/1.0
    //eg
    //https://api.iextrading.com/1.0/stock/aapl/batch?types=quote,news,chart&range=1m&last=1

    
    
    var someData
 /*   
    fetch('https://api.iextrading.com/1.0/stock/aapl/batch?types=quote,news,chart&range=1m&last=1')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    //console.log(JSON.stringify(myJson));
     // res.json(myJson)
  });
   */ 
    //////////////////////////////////////////////////////////////////////////////////
    
    
    
    
    });
    
};
