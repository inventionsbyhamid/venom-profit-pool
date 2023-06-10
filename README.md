# About the project

Introducing ProfitPool, an innovative approach to DeFi that's fair, transparent, and potentially rewarding! Contribute your Venom tokens to our collective pool, where we'll stake them with any Venom validator for 24 hours. Following the unstaking process, everyone recoups their initial contribution, but here's where it gets exciting: one lucky participant reaps ALL the staking rewards!

By leveraging Venom's native staking mechanism, which ensures profits cannot go negative, we're presenting a risk-free opportunity to potentially boost your earnings. Enter this unique pool by purchasing tickets - each priced at 1 Venom. Want to increase your odds? You can buy up to 100 tickets, multiplying your chances to walk away with the total yield. With ProfitPool, everybody wins, but one person wins big! Join us and experience the thrill of DeFi like never before.

Note: ProfitPool will leverage https://testnet.venomstake.com/ to delegate the staking. VenomStake is not live on devnet hence a StakingHelper has been introduced to demo the PoC.

# ProfitPool Smart Contracts

These smart contracts implement a new decentralized finance (DeFi) model for the Venom network, called ProfitPool. In this model, users pool their tokens into a contract, stake them with any validator, and after 24 hours, the staked tokens are returned to the users. The staking rewards are given to a single user. This model ensures a profit, as the native staking system guarantees no losses.

# Business Use Case and Future Vision for ProfitPool

ProfitPool's business use case and future vision focuses on democratizing access to decentralized finance (DeFi), enhancing user engagement through a novel profit distribution system, and offering principal protection. This concept creates a unique DeFi product with the potential for mass appeal, providing a more democratic, interactive, and safer approach to token staking.

## Business Use Case

1. **Low Barriers to Entry** : By requiring only a small amount of Venom tokens to participate, ProfitPool encourages a broader demographic to engage with DeFi. This inclusivity enables a wider range of individuals to participate in this emerging financial system.
2. **Principal Protection** : Leveraging Venom's native staking mechanism ensures that the staked amount cannot be lost, providing participants with principal protection. This reduces the financial risk typically associated with investments and could appeal to traditionally risk-averse individuals.
3. **Increased Engagement** : ProfitPool's lottery-style approach to distributing staking rewards adds an element of anticipation and excitement, enhancing user engagement and attracting a wider audience to DeFi.
4. **Education and Familiarization** : By providing a user-friendly platform for token staking, ProfitPool offers a gentle introduction to DeFi for novices. Participants can learn about these concepts without the need for substantial investment.

## Future Vision

ProfitPool's future vision centers around widespread adoption and constant innovation, aiming to become a primary gateway for mass-market participation in DeFi.

1. **Platform Expansion** : In the future, ProfitPool could expand its model to include other types of tokens within the Venom network, providing users with more opportunities to participate and win.
2. **Community Building** : As ProfitPool grows, it has the potential to cultivate a strong community of users. This community could foster collaborative improvement of the platform, contributing ideas for feature enhancements and new DeFi products.
3. **Driving DeFi Adoption** : By reducing entry barriers and providing a more engaging user experience, ProfitPool could significantly contribute to driving mainstream adoption of DeFi.
4. **Regulatory Compliance** : ProfitPool envisions staying at the forefront of regulatory compliance as the DeFi space matures and more regulations come into play, thereby increasing its credibility and appeal to a wider audience.

In a nutshell, ProfitPool has the potential to revolutionize the DeFi space by making token staking more accessible, engaging, and secure. Its innovative model could broaden the appeal of DeFi and catalyze the next wave of widespread adoption within the Venom ecosystem.

## Contracts

There are two main contracts: ProfitPool and StakingHelper.

### ProfitPool

ProfitPool is the main contract for pooling and staking tokens. It has functions for depositing tokens, initiating the staking and unstaking process, and handling the unstake callback. This contract is inherited from OwnableExternal and ReentrancyGuard contracts to ensure security and control over the contract.

`deposit()` - Users can deposit their tokens into the ProfitPool contract. The number of depositors is limited to 1000. Each user can only deposit 1 token at a time.

`initiateStake()` - This function starts the staking process. It pushes all the staging deposits to the final deposits array, clears the staging deposits, and sends the pooled tokens to the StakingHelper contract for staking.

`initiateUnStake()` - It triggers the unstaking process. The ProfitPool contract calls the StakingHelper contract to unstake the pooled tokens.

`handleUnstakeCallBack()` - This is the callback function for handling unstaking. It redistributes the unstaked tokens and yield to the depositors and the lucky user who wins the yield. Note: We simply plan to use c7 register and take hash of last 16 blocks to select lucky winner. [ https://docs.ton.org/ko/develop/smart-contracts/guidelines/random-number-generation ] Currently this is not supported in devnet. 

### StakingHelper

StakingHelper is a helper contract for staking and unstaking tokens. This contract is only callable by the ProfitPool contract to ensure security and avoid potential attacks.

`stake()` - It stakes the tokens sent from the ProfitPool contract. The total staked amount is tracked.

`unstake()` - This function unstakes the tokens and sends them back to the ProfitPool contract along with the yield.

`canUnstake()` - It is a placeholder function to calculate if unstaking is allowed based on certain staking strategy timings.

## Getting Started

1. Deploy the StakingHelper contract, and specify the ProfitPool contract's address as an argument.
2. Deploy the ProfitPool contract, specifying the owner's public key.
3. Set the StakingHelper contract's address using the `setStakingHelper` function in the ProfitPool contract.
4. Now users can start depositing tokens using the `deposit` function.
5. After enough deposits, initiate the staking process using the `initiateStake` function.
6. When ready, initiate the unstaking process using the `initiateUnStake` function.
7. The `handleUnstakeCallBack` function in the ProfitPool contract will be called, which will distribute the original deposit and yield back to the depositors.

Please ensure to have a good understanding of DeFi concepts and Solidity programming before interacting with these contracts.

# Table of Contents

- [About the project](#about-the-project)
- [Table of Contents](#table-of-contents)
- [Project structure](#project-structure)
  - [`./contracts`](#contracts)
  - [`locklift.config.ts`](#lockliftconfigts)
  - [`scripts`](#scripts)
  - [`test`](#test)
- [Getting started](#getting-started)
  - [Build contracts](#build-contracts)
  - [Tests](#tests)
  - [Deploy](#deploy)
    - [Local node](#local-node)

# Project structure

Below you will find info about the project structure and the purpose of the main directories and files.

## `./contracts`

Directory for smart contracts.

## `locklift.config.ts`

Locklift config file. You can find the basic layout [here](https://docs.venom.foundation/build/development-guides/setting-up-the-venom-smart-contract-development-environment/#configuration)

## `scripts`

Directory for migrations scripts to deploy and set up your contracts.

## `test`

Directory for tests.

# Getting started

After setting up the project with `yo venom-scaffold`, you should already have a project ready for testing and deployment.

First, let's check configs at `locklift.config.ts` [file](#lockliftconfigts). Be sure that you provide the correct settings for all required networks.

## Build contracts

```bash
npm run build
```

## Tests

To test contracts locally, we need to run the [local node](#local-node).

```bash
npm run run:local-node
```

To run tests on the venom testnet, make sure you have added a giver for that network in `locklift.config.ts`.

```bash
npm run test:local
npm run test:testnet
```

## Deploy

```bash
# deploy on the testnet
npm run deploy:testnet

# deploy on the mainnet
npm run deploy:mainnet
```

### Local node

[Local node](https://hub.docker.com/r/tonlabs/local-node) is a pre-configured Docker image with a Ganache-like local blockchain designed for dapp debugging and testing.

Container exposes the specified 80 port with nginx which proxies requests to /graphql to GraphQL API. You can access graphql endpoint at `http://localhost/graphql`

```bash
# run
npm run run:local-node

# stop
npm run stop:local-node
```
