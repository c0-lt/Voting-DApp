# Voting Dapp Project

## Setup

After cloning the project, run the following commands. Make sure ganache is running before.

```sh
# Deploy the contract locally
$ cd truffle
$ npm install
$ truffle migrate --reset
```

```sh
$ cd client
$ npm start
```

## Contract

The smart contract has been deployed on Goerli testnet at the following address
`0x235aEcE2B3192c2080dC57C67e81300F19EB0cd1`

[See on etherscan](https://goerli.etherscan.io/address/0x235aEcE2B3192c2080dC57C67e81300F19EB0cd1)

## Frontend

The frontend is available via Vercel at the following URL : https://voting-d-app-ashen.vercel.app/

## Work done

- The smart contract (Voting.sol) has been commented.
- The Dos Gas Limit on the number of proposals has been patched with a require to limit proposals up to a 100.
- Deployment of the smart contract on Goerli testnet.
- Deployment of the frontend on Vercel PaaS.
- Explain the complete voting workflow from admin & voter perspective in a video [here](https://www.loom.com/share/e8f4d51a36e4441fba0a6c1df460bad6).

## Disclaimer

Yes, you are right ! The frontend is really ugly and basic... I am a former backend developer (Python) and believe it or not, I have never learnt how to create a basic frontend. Even though it is ugly, it was really painful and a lot of work for me to come up with this. Not to mention learning React 😱🤯.
