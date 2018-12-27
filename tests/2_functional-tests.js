/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          
          //complete this one too
          assert.equal(res.status, 200);
         console.log(res.body.stockData)
          assert.property(res.body.stockData, 'stock');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          assert.equal(res.body.stockData.stock, 'GOOG');
          done();
        });
      });
      var dummylike
      test('1 stock with like', function(done) {
               chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'ebay',
               likes: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
//         console.log(res.body.stockData)
          dummylike=res.body.stockData.likes
          assert.property(res.body.stockData, 'stock');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          assert.equal(res.body.stockData.stock, 'EBAY');
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
          chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'ebay',
               likes: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
//         console.log(res.body.stockData)
          dummylike=res.body.stockData.likes
          assert.property(res.body.stockData, 'stock');
          assert.property(res.body.stockData, 'price');
          assert.equal(res.body.stockData.likes, dummylike);
          assert.equal(res.body.stockData.stock, 'EBAY');
          done();
        });
      });
      
      
      test('2 stocks', function(done) {
                       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['AMZN','WMT'], 
               likes: false})
        .end(function(err, res){
          assert.equal(res.status, 200);
//         console.log(res.body.stockData)
          dummylike=res.body.stockData.likes
          assert.property(res.body.stockData[0], 'stock');
          assert.property(res.body.stockData[0], 'price');
          assert.property(res.body.stockData[1], 'rel_likes');
          assert.equal(res.body.stockData[0].stock, 'AMZN');
          assert.equal(res.body.stockData[1].stock, 'WMT');
          done();
        });
      });
      var like1
      var like2
      test('2 stocks with like', function(done) {
        //get original likes
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'aapl'})
        .end(function(err, res){
          assert.equal(res.status, 200);
        like1 = res.body.stockData.likes
        });
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'aapl'})
        .end(function(err, res){
          assert.equal(res.status, 200);
        like2 = res.body.stockData.likes
        });
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['aapl','msft'], likes:true})
        .end(function(err, res){
          assert.equal(res.status, 200);
        //like2 = res.body.stockData.likes
          assert.equal(res.body.stockData[0].rel_likes, like1 - like2)
          assert.equal(res.body.stockData[1].rel_likes, like2 - like1)
          
          done();
        });
        
        
      });
      
    });

});
