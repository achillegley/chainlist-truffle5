var chainList = artifacts.require("ChainList.sol");

//test suite
contract("ChainList",function(accounts){
    var chainListInstance;
    var seller= accounts[1];
    var buyer= accounts[2];
    var articleName1= "article 1";
    var articleDescription1= "Description for article 1";
    var articlePrice1= 10;
    var sellerBalanceBeforeBuy, sellerBalanceAfterBuy;
    var buyerBalanceBeforeBuy, buyerBalanceAfterBuy;
    var articleName2= "article 2";
    var articleDescription2= "Description for article 2";
    var articlePrice2= 10;

    it(" should be initializes with empty values", function(){
        return chainList.deployed().then(function(instance){
            chainListInstance=instance;
            return chainListInstance.getNumberOfArticles();
        }).then(function(data){
            assert.equal(data.toNumber(), 0, "number of articles must be zero");
            return chainListInstance.getArticlesForSale();
        }).then((data)=>{
            assert.equal(data.length,0, "ther should'nt be any article for sale");
        });
    });

    //sell a first article
    it("should let us sell a first article",()=>{
        return chainList.deployed().then((instance)=>{
            chainListInstance= instance;
            return chainListInstance.sellArticle(
                articleName1, 
                articleDescription1,
                web3.utils.toWei(articlePrice1.toString(),"ether"),{from: seller}
            );

        }).then((receipt)=>{
            //check event
            assert.equal(receipt.logs.length,1,
                "one event should have ben triggered"
                );
            assert.equal(receipt.logs[0].event,
                "LogSellArticle", 
                "Event should be logSellArticle");
            assert.equal(receipt.logs[0].args._id.toNumber(),1,"id must be 1");

            assert.equal(receipt.logs[0].args._seller, seller,
            "event seller must be " + seller);
            assert.equal(receipt.logs[0].args._name, articleName1,
                "event seller must be " +articleName1);
            //assert.equal(receipt.logs[0].args._description, articleDescription,
              //  "event articleDescription must be " + articleDescription);

            assert.equal(receipt.logs[0].args._price, web3.utils.toWei(articlePrice1.toString(),"ether"), "article price must be zero " + web3.utils.toWei(articlePrice1.toString(), "ether"));
        
            return chainListInstance.getNumberOfArticles();
        }).then((data)=>{
            assert.equal(data,1,"number of articles must be one");

            return chainListInstance.getArticlesForSale();
        }).then(function(data){
            assert.equal(data.length,1,"there must be one article for sale");
            assert.equal(data[0].toNumber(),1,"article id must be 1");

            return chainListInstance.articles(data[0]);
        }).then((data)=>{
            assert.equal(data[0].toNumber(),1,"article id must be 1");
            assert.equal(data[1], seller, "seller must be "+ seller);
            assert.equal(data[2],0x0, "buyer must be empty");
            assert.equal(data[3],articleName1, "article name must be "+ articleName1);
            assert.equal(data[4],articleDescription1, "article description must be "+ articleDescription1);
            assert.equal(data[5], web3.utils.toWei(articlePrice1.toString(),"ether"), "article price must be " + web3.utils.toWei(articlePrice1.toString(),"ether"));
        });
    });

    //sell a sencond article
    it("should let us sell a second article",()=>{
        return chainList.deployed().then((instance)=>{
            chainListInstance= instance;
            return chainListInstance.sellArticle(
                articleName2, 
                articleDescription2,
                web3.utils.toWei(articlePrice2.toString(),"ether"),{from: seller}
            );

        }).then((receipt)=>{
            //check event
            assert.equal(receipt.logs.length,1,
                "one event should have ben triggered"
                );
            assert.equal(receipt.logs[0].event,
                "LogSellArticle", 
                "Event should be logSellArticle");
            assert.equal(receipt.logs[0].args._id.toNumber(),2,"id must be 2");

            assert.equal(receipt.logs[0].args._seller, seller,
            "event seller must be " +seller);
            assert.equal(receipt.logs[0].args._name, articleName2,
                "event seller must be " +articleName2);
            //assert.equal(receipt.logs[0].args._description, articleDescription,
              //  "event articleDescription must be " + articleDescription);

            assert.equal(receipt.logs[0].args._price, web3.utils.toWei(articlePrice2.toString(),"ether"), "article price must be zero " + web3.utils.toWei(articlePrice2.toString(), "ether"));
        
            return chainListInstance.getNumberOfArticles();
        }).then((data)=>{
            assert.equal(data,2,"number of articles must be two");

            return chainListInstance.getArticlesForSale();
        }).then(function(data){
            assert.equal(data.length,2,"there must be two articles for sale");
            assert.equal(data[1].toNumber(),2,"article id must be 2");

            return chainListInstance.articles(data[1]);
        }).then((data)=>{
            assert.equal(data[0].toNumber(),2,"article id must be 2");
            assert.equal(data[1], seller, "seller must be "+ seller);
            assert.equal(data[2],0x0, "buyer must be empty");
            assert.equal(data[3],articleName2, "article name must be "+ articleName2);
            assert.equal(data[4],articleDescription2, "article description must be "+ articleDescription2);
            assert.equal(data[5], web3.utils.toWei(articlePrice2.toString(),"ether"), "article price must be " + web3.utils.toWei(articlePrice2.toString()));
        });
    });

    /*
    it("should sell an article", function(){
        return chainList.deployed().then(function(instance){
            chainListInstance= instance;
            return chainListInstance.sellArticle(
                 articleName1,
                 articleDescription1,
                 web3.utils.toWei( articlePrice1.toString(),"ether"),
                 {from:seller}

                ).then(function(){
                    return chainListInstance.getArticle();
                        }).then(function(data){
                            assert.equal(data[0], seller, "seller must be " + seller);
                            assert.equal(data[1], 0x0, "buyer must be empty " );
                            assert.equal(data[2], articleName, "article name must be " + articleName);
                            assert.equal(data[3], articleDescription, "article description must be " + articleDescription) ;
                            assert.equal(data[4], web3.utils.toWei(articlePrice.toString(),"ether"), "article price must be zero " + articlePrice.toString());
                            })
                        })
    })*/

    //buy the first article
    it("should buy an article",function(){
        return chainList.deployed().then((instance)=>{
            chainListInstance=instance;
            //record balances of seller and buyer before de buy

            web3.eth.getBalance(seller, function(balance){
                
                return balance
            }).then((balance)=>{
                sellerBalanceBeforeBuy=web3.utils.fromWei(balance.toString(),'ether');
                web3.eth.getBalance(buyer, function(balance){
                    return balance
                }).then((balance)=>{
                    buyerBalanceBeforeBuy=web3.utils.fromWei(balance.toString(),'ether');
                    return chainListInstance.buyArticle(1,{
                        from: buyer,
                        value: web3.utils.toWei(articlePrice1.toString(),"ether")
                    });
                }).then((receipt)=>{
                    assert.equal(receipt.logs.length,1,
                        "one event should have ben triggered"
                        );
                    assert.equal(receipt.logs[0].event,
                        "LogBuyArticle", 
                        "Event should be LogBuyArticle");
                    assert.equal(receipt.logs[0].args._id.toNumber(),1,"article id must be 1");
                    assert.equal(receipt.logs[0].args._seller, seller,
                    "event seller must be " +seller);
                    assert.equal(receipt.logs[0].args._buyer, buyer,
                        "event buyer must be " +buyer);
        
                    assert.equal(receipt.logs[0].args._name, articleName1,
                        "event seller must be " +articleName1);
                    //assert.equal(receipt.logs[0].args._description, articleDescription,
                      //  "event articleDescription must be " + articleDescription);
        
                    assert.equal(receipt.logs[0].args._price, web3.utils.toWei(articlePrice1.toString(),"ether"), "article price must be zero " + web3.utils.toWei(articlePrice1.toString(), "ether"));
               
                    //record balances of buyer and seller after the buy
        
                    //sellerBalanceAfterBuy= web3.utils.fromWei(web3.eth.getBalance(seller),'ether').toNumber();
                    //buyerBalanceAfterBuy= web3.utilis.fromWei(web3.eth.getBalance(buyer),'ether').toNumber();
                    
                    sellerBalanceAfterBuy=web3.utils.fromWei(balance.toString(),'ether');
                    web3.eth.getBalance(buyer, function(balance){
                        return balance
                    }).then((balance)=>{
                        buyerBalanceAfterBuy=web3.utils.fromWei(balance.toString(),'ether');
                        assert(sellerBalanceAfterBuy == sellerBalanceBeforeBuy + articlePrice1, "seller should have earned "+ sellerBalanceBeforeBuy + "ETH");
                        assert(buyerBalanceAfterBuy <= buyerBalanceBeforeBuy - articlePrice1, "buyer should have spend "+ articlePrice1 + "ETH");
                         //check the effect of buy on balances of buyer and seller accounting for gas
                        return chainListInstance.getArticlesForSale();
                    }).then((data)=>{
                        assert.equal(data.length,1,"there should not be only 1 article");
                        assert.equal(data[0].toNumber,2, "article 2 must be the only article left for sale");
                        //assert.equal(data[0], seller, "seller must be " + seller);
                        //assert.equal(data[1], buyer, "buyer must be empty "+ buyer );
                        //assert.equal(data[2], articleName, "article name must be " + articleName);
                        //assert.equal(data[3], articleDescription, "article description must be " + articleDescription) ;
                        //assert.equal(data[4], web3.utils.toWei(articlePrice.toString(),"ether"), "article price must be zero " + articlePrice.toString());
                        return chainListInstance.getNumberOfArticles();
                    }).then(function(data){
                        assert.eqaul(data.toNumber(),2,"there should still be 2 articles in total");
                    });
                   
                });
            });
        })
    });
    /*
    it("should trigger an event when a new article is sold", function(){
        return chainList.deployed().then(function(instance){
            chainListInstance=instance;
            return chainListInstance.sellArticle(articleName,
                articleDescription, 
                web3.utils.toWei(articlePrice.toString(), "ether"),
                {from:seller}
                ).then(function(receipt){
                    assert.equal(receipt.logs.length,1,
                        "one event should have ben triggered"
                        );
                    assert.equal(receipt.logs[0].event,
                        "LogSellArticle", 
                        "Event should be logSellArticle");
                    assert.equal(receipt.logs[0].args._seller, seller,
                    "event seller must be " +seller);
                    assert.equal(receipt.logs[0].args._name, articleName,
                        "event seller must be " +articleName);
                    //assert.equal(receipt.logs[0].args._description, articleDescription,
                      //  "event articleDescription must be " + articleDescription);

                    assert.equal(receipt.logs[0].args._price, web3.utils.toWei(articlePrice.toString(),"ether"), "article price must be zero " + web3.utils.toWei(articlePrice.toString(), "ether"));
                });
        })
    })*/
});