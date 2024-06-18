# Atlantis 2.0

Pixel Retro Game Proof of Concept, leveraging ERC721 NFTs for ownership of unique plots in a virtual Atlantis world on the Ethereum Virtual Machine (EVM).


<p align="center">
  <img src="https://i.ibb.co/s2BhgfB/Screenshot-from-2024-06-18-16-05-11.png" width="600" title="hover text">
</p>

## Features
- Decentralized Ownership: ERC721 tokens provide verifiable ownership of virtual plots.
- 2D WebGL graphics: Engage in a retro-themed virtual world, exploring and trading virtual land.
- Smart Contract Integration: Leveraging Solidity smart contracts on the Ethereum blockchain for secure transactions.
- Proof of Concept: Showcase the potential of NFTs in gaming and virtual economies on the EVM.

## Guides

### Smart contract Dev: 
You can update the smart contract under `/smartcontract/contracts/Atlantis.sol`
- After any changes to the contract, run:

```bash
npm run build
# or
yarn build
```

to compile your contracts. This will also detect the [Contracts Extensions Docs](https://portal.thirdweb.com/contractkit) detected on your contract.

- When you're ready to deploy your contracts, just run one of the following command to deploy you're contracts:

```bash
npm run deploy
# or
yarn deploy
```

### Once the smartContract is deployed on your prefered EVM Network :
-  Network adaptations ( defaults to `Seploia` ) in `src/utils/client.ts` & `src/components/EvmAddress.tsx` ( explorerLink )
-  Contract adaptations :
CD into `/smartcontract` subfolder & generate the procompiled smartContract definitions using:
```bash
npx thirdweb generate <chainId>/<contract-address>
```
This will generate a new thirdweb directory in your own project, containing the precompiled extension for the contract at the given address.
Now use the contents of the `<contract-address>.ts` file to update the `src/utils/contractUtils.ts` utils File.

And finaly update the env `VITE_TEMPLATE_CONTRACT_ADDRESS` with the correct deployed contract address.

## Map Customization 
- You can easiliy customize the map Tiles under `src/utils/gameConfig.ts` 
- Make sure to update the `useMapCalculations` hook if you've changed the map tiling layout ( Road = 2 tiles, plot = 9 tiles ) 
