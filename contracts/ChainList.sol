pragma solidity >0.4.17 < 0.9.0;

import "./Ownable.sol";

contract ChainList is Ownable{
    //custom types
    struct Article{
        uint id;
        address  seller;
        address buyer;
        string name;
        string description;
        uint256 price;
    }
    
    //state variables
    
    mapping( uint => Article ) public articles;
    uint articleCounter;


    //events
    event LogSellArticle(
        uint indexed _id,
        address indexed _seller,
        string _name,
        uint256 _price
    );

    event LogBuyArticle(
        uint indexed _id,
        address indexed _seller,
        address indexed _buyer,
        string _name,
        uint256 _price
    );

    //event LogMessage( string message);

    //consturtor
    

    //deactivate the contract
    function kill() public onlyOwner{
        //only allow the contract owner
        //require(msg.sender == owner);
        selfdestruct(payable(owner));
    }
    //sell article 
    function sellArticle(string memory _name ,string memory _description, uint256  _price) public{
        //increment article counter
        articleCounter++;
        //store this article
        articles[articleCounter]= Article(
            articleCounter,
            msg.sender,
            address(0x0),
            _name,
            _description,
            _price
        );
        emit LogSellArticle(articleCounter, msg.sender,_name,_price);
    }

    //get an article
    //function getArticle() public view returns(
       // address _seller,
        //address _buyer,
       // string memory _name ,
       // string memory _description, 
       // uint256  _price){
        //    return(seller, buyer,name, description,price);
    //}

    //fetch the number of articles
    function getNumberOfArticles() public view returns(uint){
        return articleCounter;
    }

    //fetch and return all article Ids for article still for sale
    function getArticlesForSale() public view returns( uint[] memory){
        //prepare output array
        uint[] memory articleIds = new uint[](articleCounter);
        uint numberOfArticlesForSale=0;
        for(uint i= 1; i<= articleCounter; i++)
        {
            //keep the ID if the article is still for sale
            if(articles[i].buyer == address(0x0)){
                articleIds[numberOfArticlesForSale]= articles[i].id;
                numberOfArticlesForSale++;
            }
           
        }
        //copy the articleIds array into a smaller forSale Array
        uint[] memory forSale=new uint[](numberOfArticlesForSale) ;
        for(uint j = 0; j< numberOfArticlesForSale; j++){
            forSale[j]= articleIds[j];
        }
        return forSale;
    }

    //buy an article
    function buyArticle( uint _id) payable public{
        //we check whether there is an article for sale
        require( articleCounter > 0,"There is no article for sale.");
        
        //we check that the article exists
        require(_id>0 && _id<= articleCounter,"the article not exist");
        //we retrieve the article for the mapping
        Article storage article =articles[_id];
        //we check that the article has not bee sold yet 
        require(article.buyer == address(0x0),"The article has already been sold.");
        //emit LogMessage("buyer must e empty checked");
        //we don't allow the seller to buy his own article 
        require(msg.sender != article.seller, "The seller cannot buy their own article.");
        //emit LogMessage("buyer must not be sender checked");

        //we check that the value sent corresponds to the price of the article
        require(msg.value == article.price, "The price of the article does not match the value sent.");
        //emit LogMessage("price must be the same checked");

        //keep buyer's information

        article.buyer = msg.sender;


        //the buyer can pay the seller
        //address payable sellerPayable = payable(seller);
        
        (payable(article.seller)).transfer(msg.value);

        //trigger the event
        emit LogBuyArticle(article.id,article.seller,article.buyer, article.name, article.price);

    }
}