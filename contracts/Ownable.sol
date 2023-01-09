pragma solidity >0.4.99 < 0.9.0;

contract Ownable{
    //state variables
    address owner;

    //modifiers
    modifier onlyOwner(){
        require( msg.sender == owner);
        _;
    }

    //constructor
    constructor () public {
        owner= msg.sender;
    }
}