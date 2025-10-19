Here’s your **formatted and polished README.md**, with improved Markdown structure, syntax highlighting, and consistent formatting:

---

# 🪩 Base dApp: Smart Contract Integration

This project demonstrates how to connect a smart contract to a **Next.js frontend** using **wagmi**, **viem**, and the **Base blockchain**.
It includes a simple **Greeter** contract that allows users to read and update a greeting message on-chain.

---

## 📚 Table of Contents

* [Project Structure](#project-structure)
* [Smart Contract Setup](#smart-contract-setup)
* [Frontend Integration](#frontend-integration)

  * [1. Contract Configuration](#1-contract-configuration)
  * [2. Custom Hook](#2-custom-hook)
* [Environment Variables](#environment-variables)
* [Running the Project](#running-the-project)
* [Key Concepts](#key-concepts)
* [Learn More](#learn-more)

---

## 🏗 Project Structure

```
src/
├── contracts/
│   └── Greeter.ts          # Contract ABI and address
├── hooks/
│   └── useGreeter.ts       # Custom hook for contract interaction
└── app/
    └── page.tsx            # Main page component
```

---

## 💡 Smart Contract Setup

The **Greeter** contract is a simple Solidity smart contract with the following functionality:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Greeter {
    string public greeting;

    constructor(string memory _initialGreeting) {
        greeting = _initialGreeting;
    }

    function setGreeting(string memory _newGreeting) public {
        greeting = _newGreeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }
}
```

---

## ⚛️ Frontend Integration

### 1. Contract Configuration

The contract’s ABI and address are stored in **`src/contracts/Greeter.ts`**:

```typescript
export const GREETER_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_GREETER_CONTRACT_ADDRESS as `0x${string}`;

export const GREETER_ABI = [
  {
    inputs: [
      { internalType: "string", name: "_initialGreeting", type: "string" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "greet",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "greeting",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_newGreeting", type: "string" }],
    name: "setGreeting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
```

---

### 2. Custom Hook

The `useGreeter` hook in **`src/hooks/useGreeter.ts`** handles contract interactions:

```typescript
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { GREETER_ABI, GREETER_CONTRACT_ADDRESS } from "../contracts/Greeter";
import { baseSepolia } from "viem/chains";

export const useGreeter = () => {
  // Read greeting from the contract
  const { data: greeting, refetch: refetchGreeting } = useReadContract({
    address: GREETER_CONTRACT_ADDRESS,
    abi: GREETER_ABI,
    functionName: "greet",
    chainId: baseSepolia.id,
  });

  // Write greeting to the contract
  const { writeContract, data: txHash } = useWriteContract();

  const setGreeting = async (newGreeting: string) => {
    await writeContract({
      address: GREETER_CONTRACT_ADDRESS,
      abi: GREETER_ABI,
      functionName: "setGreeting",
      args: [newGreeting],
    });
    await refetchGreeting();
  };

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  return { greeting, setGreeting, isLoading, isSuccess };
};
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in your project root with the following variable:

```bash
NEXT_PUBLIC_GREETER_CONTRACT_ADDRESS=your_contract_address_here
```

---

## 🧩 Running the Project

### Install dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install

# Using bun
bun install
```

### Start the development server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev

# Using bun
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view your application.

---

## 🪙 Key Concepts

* **wagmi**: A collection of React Hooks for Ethereum, making it easy to connect wallets and interact with smart contracts.
* **viem**: A TypeScript interface for Ethereum, providing low-level building blocks for blockchain interaction.
* **ABI (Application Binary Interface)**: Defines the methods and structures used to interact with the smart contract.
* **Hooks**: Custom React hooks that encapsulate blockchain logic, improving code readability and reusability.

---

## 📘 Learn More

* [wagmi Documentation](https://wagmi.sh)
* [viem Documentation](https://viem.sh)
* [Base Documentation](https://docs.base.org)
* [Next.js Documentation](https://nextjs.org/docs)
* [OnchainKit Documentation](https://docs.base.org/onchainkit)

---

Would you like me to make this **README render beautifully on GitHub** (with emoji sections, badges, and a code preview image)? I can add that styling next.
