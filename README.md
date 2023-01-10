# ChainSkills Truffle Box

#disclamer
this course is a little bit outdated but it help me understand necessary( a lot)things arrond web3 developpement and blockchain in general.
I builded this final project using the new configs and updated versions off tool like truffle, geth, ganache, even the solidity version i use is different, also the way communicate with the web3 provider using metamask.
Be sure you're  technically capable to do things by your self research before purchasing.
You can still write to the formater is you're having a problem .

This Truffle Box has all you need to create a DApp by following the course delivered by [ChainSkills](https://www.udemy.com/getting-started-with-ethereum-solidity-development/).

This box has been based from [pet-shop-box](https://github.com/truffle-box/pet-shop-box).

## Installation

1. Install Truffle globally.
    ```javascript
    npm install -g truffle
    ```

2. Download the box. This also takes care of installing the necessary dependencies.
    ```javascript
    truffle unbox chainskills/chainskills-box-truffle5
    ```

3. Run the development console.
    ```javascript
    truffle develop
    ```

4. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with `truffle`.
    ```javascript
    compile
    migrate
    ```

5. Run the `liteserver` development server (outside the development console) for front-end hot reloading. Smart contract changes must be manually recompiled and migrated.
    ```javascript
    // Serves the front-end on http://localhost:3000
    npm run dev
    ```
