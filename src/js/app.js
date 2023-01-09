App = {
    
    web3Provider: null,
    contracts: {},
    account: 0x0,
    loading:false,
    
    init() {
        //load articles
       // var articlesRow=$('#articlesRow');
        //var articleTemplate= $('#articleTemplate');
        //articleTemplate.find('.panel-title').text('article 1');
        //articleTemplate.find('.article-description').text('Description for article 1');
        //articleTemplate.find('.article-price').text('10.23');
        //articleTemplate.find('.article-seller').text('0x1234567890')

        //articlesRow.append(articleTemplate.html());

        //intialize web3
        if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'){
            //getting Permission to access. This is for when the user has new MetaMask
            window.ethereum.enable();
            App.web3Provider = window.ethereum;
            web3 = new Web3(window.ethereum);
          
          }else if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
            web3 = new Web3(window.web3.currentProvider);
            // Acccounts always exposed. This is those who have old version of MetaMask
          
          } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
            web3 = new Web3(App.web3Provider);
          
          }

       /* if(typeof web3 !== "undefined" && typeof window.ethereum !== 'undefined')
        {
            //reuse the provider of the web3 object provide by metamask
            App.web3Provider = web3.currentProvider;

        }else{
            //create a new provider and plug it  directly into our local node
            App.web3Provider= new Web3.providers.HttpProvider('http://localhost:8545');
        }*/
        //web3= new Web3(App.web3Provider);

        web3.eth.getAccounts(function(error, accounts) {
          })
      

        App.displayAccountInfo();

        return App.initWeb3();
    },

    async initWeb3() {
        /*
         * Replace me...
         */

        return App.initContract();
    },

    displayAccountInfo:function(){
       
        web3.eth.getCoinbase(function(err,account){
            if(err === null){
                App.account= account;
                $('#account').text(account);
                web3.eth.getBalance(account, function(err,balance){
                    if(err === null){
                        $('#accountBalance').text(web3.utils.fromWei(balance,"ether")+ "ETH");
                    }
                })
            }
        });
    },
    async initContract() {
        $.getJSON('ChainList.json', function(ChainListArtifact){
            //get the contract artifact file and use it to instantiate a truffle contract abstraction
            App.contracts.ChainList= TruffleContract(ChainListArtifact);
            //set the provider for our contracts
            App.contracts.ChainList.setProvider(App.web3Provider);
            //listen to Events
            App.listenToEvent();
            //retrieve the article from the contract
            return App.reloadArticles();
        })
    },

    reloadArticles: function(){
        //avoid reentry 
        if(App.loading){
            return;
        }
        App.loading=true;
        //refresh account information becoause the balance might have changed
        App.displayAccountInfo();

        var chainListInstance;

        
        App.contracts.ChainList.deployed().then(function(instance){
            chainListInstance=instance;
            return chainListInstance.getArticlesForSale();
        }).then(function(articleIds){
            //retrieve the article placeholder and clear it
            $('#articlesRow').empty();
            for(var i= 1; i< articleIds.length+1; i++){
                chainListInstance.articles(i).then((article)=>{
                   
                    App.displayArticle(article[0],article[1],article[3],article[4], article[5]);
                });
            }
            App.loading =false;

            //if(article[0] == 0x0)
            //{
                //no article to display
              //  return;
            //}
            //else{
               
                //var price= web3.utils.fromWei((article[4]).toString(),"ether")
                //retrieve the article template and fill it with data
                //var articleTemplate= $('#articleTemplate');
                //articleTemplate.find('.panel-title').text(article[2]);
                //articleTemplate.find('.article-description').text(article[3]);
                //articleTemplate.find('.article-price').text(price);
                //articleTemplate.find('.btn-buy').attr('data-value',price);

                /*var seller = article[0];
                if( seller.toLowerCase() == App.account){
                    seller = "You";
                }
                articleTemplate.find('.article-seller').text(seller);
                //buyer 
                var buyer= article[1];
                if(buyer == App.account){
                    buyer="You";
                }else if( buyer == 0x0){
                    buyer = "No one yet";
                }
                articleTemplate.find('.article-buyer').text(buyer);
                if((article[0]).toLowerCase() == App.account || article[1] != 0x0)
                {
                    articleTemplate.find('.btn-buy').hide();
                }else{
                    articleTemplate.find('.btn-buy').show();
                }

                //add this article to article row

                $('#articlesRow').append(articleTemplate.html());*/

            //}
        }).catch(function(err){
            //console.error(err);
            App.loading=false;
        });
    },

    displayArticle: (id, seller, name, description, price)=>{
        var articleRow = $('#articlesRow');
        var etherPrice= web3.utils.fromWei(price, 'ether');
        var articleTemplate = $('#articleTemplate');
        articleTemplate.find('.panel-title').text(name);
        articleTemplate.find('.article-description').text(description);
        articleTemplate.find('.article-price').text(etherPrice + "ETH");
        articleTemplate.find('.btn-buy').attr('data-id',id);
        articleTemplate.find('.btn-buy').attr('data-value',etherPrice);

        //seller
        if(seller.toLowerCase() == App.account){
            articleTemplate.find('.article-seller').text("You");
            articleTemplate.find('.btn-buy').hide();
        }
        else{
            articleTemplate.find('.article-seller').text(seller);
            articleTemplate.find('btn-buy').show();
        }

        //add this new article
        articleRow.append(articleTemplate.html());
    },
    sellArticle: function(){
        //retrieve the detail of the article 
        var _article_name= $('#article_name').val();
        var _description=$('#article_description').val();
        var _price= web3.utils.toWei((parseFloat($('#article_price').val()|| 0)).toString(),"ether");
    
        if((_article_name.trim()== '') || (_price==0)){
            //nothing to sell
            return false;
        }

        App.contracts.ChainList.deployed().then(function(instance){
            return instance.sellArticle(_article_name,_description,_price,{
                from: App.account,
                gas: 500000
            });
        }).then(function(result){
            //console.log("good");
           App.reloadArticles();
        }).catch(function(err){
           console.error(err); 
        });
    },
    //listen to events trigged by the contract
    listenToEvent: function (){

        App.contracts.ChainList.deployed().then(function(instance){
            instance.LogSellArticle((error,event)=>{
                if(!error){
                    console.log(event)
                  $('#events').append('<li class="list-group-item"/>'+
                    event.args._name + ' is now for sale </li>'
                  )  
                }else{
                    console.error(error);
                }
                App.reloadArticles();
            });

            instance.LogBuyArticle((error,event)=>{
                if(!error){
                    console.log(event)
                  $('#events').append('<li class="list-group-item"/>'+
                    event.args._buyer + ' bought '+event.args._name +'</li>' 
                  )  
                }else{
                    console.error(error);
                }
                App.reloadArticles();
            })
        })

    },
    

    buyArticle: function(){
     event.preventDefault();
     
     //retrieve the article price
        var _articleId= $(event.target).data('id');
        var _price= parseFloat($(event.target).data('value'));
        App.contracts.ChainList.deployed().then((instance)=>{
            return instance.buyArticle(_articleId,{
                from: App.account,
                value: web3.utils.toWei(_price.toString(),'ether'),
                gas:500000 
            });
        }).catch(function(error){
            console.log(error);
        });
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
