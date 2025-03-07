#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const figlet = require('figlet');

const welcome = `
███████╗ ██████╗ █████╗ ███████╗███████╗ ██████╗ ██╗     ██████╗       ██████╗  ██████╗  ██████╗ ████████╗███████╗████████╗ ██████╗  ██████╗██╗  ██╗
██╔════╝██╔════╝██╔══██╗██╔════╝██╔════╝██╔═══██╗██║     ██╔══██╗      ██╔══██╗██╔═══██╗██╔═══██╗╚══██╔══╝██╔════╝╚══██╔══╝██╔═══██╗██╔════╝██║ ██╔╝
███████╗██║     ███████║█████╗  █████╗  ██║   ██║██║     ██║  ██║█████╗██████╔╝██║   ██║██║   ██║   ██║   ███████╗   ██║   ██║   ██║██║     █████╔╝ 
╚════██║██║     ██╔══██║██╔══╝  ██╔══╝  ██║   ██║██║     ██║  ██║╚════╝██╔══██╗██║   ██║██║   ██║   ██║   ╚════██║   ██║   ██║   ██║██║     ██╔═██╗ 
███████║╚██████╗██║  ██║██║     ██║     ╚██████╔╝███████╗██████╔╝      ██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████║   ██║   ╚██████╔╝╚██████╗██║  ██╗
╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝      ╚═════╝ ╚══════╝╚═════╝       ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝   ╚═╝    ╚═════╝  ╚═════╝╚═╝  ╚═╝
`;

program
  .version("1.0.0")
  .description("Scaffold a Rootstock dApp")
  .argument("<project-name>", "Name of the project")
  .action(async (projectName) => {
    console.log(chalk.blue(`\nCreating project: ${projectName}...\n`));
  });

console.log(chalk.blue(welcome));
console.log(chalk.green('Welcome to Scaffold-RootStock CLI!'));
console.log(chalk.cyan('Build your blockchain dApp with a customized stack'));

const rootstockERC20Contract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RootstockToken is ERC20, Ownable {
    constructor() ERC20("Rootstock Token", "RSK") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}`;

const proxyContractCode = `0x60806040523661001357610011610017565b005b6100115b610027610022610074565b6100b9565b565b606061004e83836040518060600160405280602781526020016102fb602791396100dd565b9392505050565b73ffffffffffffffffffffffffffffffffffffffff163b151590565b90565b60006100b47f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc5473ffffffffffffffffffffffffffffffffffffffff1690565b905090565b3660008037600080366000845af43d6000803e8080156100d8573d6000f35b3d6000fd5b606073ffffffffffffffffffffffffffffffffffffffff84163b610188576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f60448201527f6e7472616374000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b6000808573ffffffffffffffffffffffffffffffffffffffff16856040516101b0919061028d565b600060405180830381855af49150503d80600081146101eb576040519150601f19603f3d011682016040523d82523d6000602084013e6101f0565b606091505b509150915061020082828661020a565b9695505050505050565b6060831561021957508161004e565b8251156102295782518084602001fd5b816040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161017f91906102a9565b60005b83811015610278578181015183820152602001610260565b83811115610287576000848401525b50505050565b6000825161029f81846020870161025d565b9190910192915050565b60208152600082518060208401526102c881604085016020870161025d565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016919091016040019291505056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a26469706673582212201e3c9348ed6dd2f363e89451207bd8df182bc878dc80d47166301a510c8801e964736f6c634300080a0033`;

async function main() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is your project name?',
        default: 'my-rootstock-dapp'
      },
      {
        type: 'list',
        name: 'frontend',
        message: 'Select your frontend framework:',
        choices: ['Next.js', 'React.js']
      },
      {
        type: 'list',
        name: 'language',
        message: 'Select your programming language:',
        choices: ['TypeScript', 'JavaScript']
      },
      {
        type: 'confirm',
        name: 'installDeps',
        message: 'Do you want to install dependencies after project creation?',
        default: true
      }
    ]);

    const projectPath = path.join(process.cwd(), answers.projectName);
    
    if (fs.existsSync(projectPath)) {
      console.log(chalk.red(`The directory ${answers.projectName} already exists. Please choose a different name.`));
      return;
    }
    
    // Create project directory
    fs.mkdirSync(projectPath, { recursive: true });
    
    const spinner = ora('Creating project structure...').start();
    
    // Create package.json
    const packageJson = {
      name: answers.projectName,
      version: '0.1.0',
      private: true,
      scripts: {
        frontend: 'cd frontend && npm run dev',
        blockchain: 'cd blockchain && npx hardhat node',
        deploy: 'cd blockchain && npx hardhat run scripts/deploy.js --network localhost',
        test: 'cd blockchain && npx hardhat test'
      }
    };
    
    fs.writeFileSync(
      path.join(projectPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    // Create README.md
    const readmeContent = `# ${answers.projectName}
    
## What is this project

This is a dApp project built with:
* Frontend: ${answers.frontend} with Tailwind CSS
* Language: ${answers.language}
* Smart Contracts: Solidity with Hardhat
* Wallet Connection: RainbowKit
* Blockchain Interactions: Wagmi
* Network: Rootstock (RSK)

## Getting Started

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Start local blockchain:
   \`\`\`
   npm run blockchain
   \`\`\`

3. Deploy contracts:
   \`\`\`
   npm run deploy
   \`\`\`

4. Start frontend:
   \`\`\`
   npm run frontend
   \`\`\`
`;
    
    fs.writeFileSync(
      path.join(projectPath, 'README.md'),
      readmeContent
    );
    
    // Create blockchain directory for Hardhat
    const blockchainDir = path.join(projectPath, 'blockchain');
    fs.mkdirSync(blockchainDir);
    fs.mkdirSync(path.join(blockchainDir, 'contracts'));
    fs.mkdirSync(path.join(blockchainDir, 'scripts'));
    fs.mkdirSync(path.join(blockchainDir, 'test'));
    
    // Create hardhat.config.js
    const hardhatConfig = `require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.10",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    rootstock: {
      url: "https://public-node.rsk.co",
      chainId: 30,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    rootstockTestnet: {
      url: "https://public-node.testnet.rsk.co",
      chainId: 31,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};`;
    
    fs.writeFileSync(
      path.join(blockchainDir, 'hardhat.config.js'),
      hardhatConfig
    );
    
    // Create blockchain package.json
    const blockchainPackageJson = {
      name: `${answers.projectName}-blockchain`,
      version: '0.1.0',
      private: true,
      devDependencies: {
        "@nomicfoundation/hardhat-toolbox": "^4.0.0",
        "hardhat": "^2.19.1",
        "@openzeppelin/contracts": "^4.9.3"
      }
    };
    
    fs.writeFileSync(
      path.join(blockchainDir, 'package.json'),
      JSON.stringify(blockchainPackageJson, null, 2)
    );
    
    // Create ERC20 token contract
    fs.writeFileSync(
      path.join(blockchainDir, 'contracts', 'RootstockToken.sol'),
      rootstockERC20Contract
    );
    
    // Create deploy script
    const deployScript = `const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying RootstockToken...");
  
  const RootstockToken = await ethers.getContractFactory("RootstockToken");
  const token = await RootstockToken.deploy();
  
  await token.deploymentTransaction().wait();
  
  console.log("RootstockToken deployed to:", token.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });`;
  
    fs.writeFileSync(
      path.join(blockchainDir, 'scripts', 'deploy.js'),
      deployScript
    );
    
    // Create frontend directory
    const frontendDir = path.join(projectPath, 'frontend');
    fs.mkdirSync(frontendDir);
    
    // Set up frontend based on chosen framework
    if (answers.frontend === 'Next.js') {
      const templateDir = answers.language === 'TypeScript' ? 
        'next-typescript-template' : 'next-javascript-template';
      
      // Create Next.js with appropriate template
      execSync(`npx create-next-app@latest ${frontendDir} --tailwind --eslint --app --no-src-dir --${answers.language === 'TypeScript' ? 'ts' : 'js'}`, { stdio: 'ignore' });
      
      // Create config files
      spinner.text = 'Setting up Next.js frontend...';
    } else {
      // Create React app
      execSync(`npx create-react-app ${frontendDir} ${answers.language === 'TypeScript' ? '--template typescript' : ''}`, { stdio: 'ignore' });
      
      // Install Tailwind CSS
      execSync(`cd ${frontendDir} && npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`, { stdio: 'ignore' });
      
      // Configure Tailwind CSS
      const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
      
      fs.writeFileSync(
        path.join(frontendDir, 'tailwind.config.js'),
        tailwindConfig
      );
      
      // Add Tailwind directives to CSS
      const tailwindDirectives = `@tailwind base;
@tailwind components;
@tailwind utilities;`;
      
      fs.writeFileSync(
        path.join(frontendDir, 'src', 'index.css'),
        tailwindDirectives
      );
      
      spinner.text = 'Setting up React.js frontend...';
    }
    
    // Install blockchain interaction packages
    spinner.text = 'Installing web3 dependencies...';
    execSync(`cd ${frontendDir} && npm install wagmi viem @rainbow-me/rainbowkit`, { stdio: 'ignore' });
    
    // Create Scaffold-ETH-like pages and components
    createFrontendFiles(frontendDir, answers);
    
    if (answers.installDeps) {
      spinner.text = 'Installing project dependencies...';
      execSync(`cd ${projectPath} && npm install`, { stdio: 'ignore' });
      execSync(`cd ${blockchainDir} && npm install`, { stdio: 'ignore' });
    }
    
    spinner.succeed('Project created successfully!');
    
    console.log(chalk.green(`\n✨ Project ${answers.projectName} created successfully! ✨\n`));
    console.log(chalk.cyan('Next steps:'));
    console.log(chalk.white(`1. cd ${answers.projectName}`));
    
    if (!answers.installDeps) {
      console.log(chalk.white('2. npm install'));
      console.log(chalk.white('3. cd blockchain && npm install'));
      console.log(chalk.white('4. cd ../frontend && npm install'));
      console.log(chalk.white('5. cd .. && npm run blockchain (in a separate terminal)'));
      console.log(chalk.white('6. npm run deploy'));
      console.log(chalk.white('7. npm run frontend'));
    } else {
      console.log(chalk.white('2. npm run blockchain (in a separate terminal)'));
      console.log(chalk.white('3. npm run deploy'));
      console.log(chalk.white('4. npm run frontend'));
    }
  } catch (error) {
    console.error(chalk.red('Error creating project:'), error);
  }
}

function createFrontendFiles(frontendDir, answers) {
  const isTypescript = answers.language === 'TypeScript';
  const isNextJs = answers.frontend === 'Next.js';
  const fileExt = isTypescript ? 'tsx' : 'jsx';
  
  // Create base files based on framework
  if (isNextJs) {
    // For Next.js, we'll create pages in app directory
    fs.mkdirSync(path.join(frontendDir, 'app', 'debug-contracts'), { recursive: true });
    fs.mkdirSync(path.join(frontendDir, 'app', 'block-explorer'), { recursive: true });
    fs.mkdirSync(path.join(frontendDir, 'components'), { recursive: true });
    
    // Create layout file
    const layoutContent = `${isTypescript ? "'use client';\n\nimport { ReactNode } from 'react';" : "'use client';\n"}
import { Providers } from './providers';
import Navbar from '../components/Navbar';
import './globals.css';

export default function RootLayout({ children }${isTypescript ? ': { children: ReactNode }' : ''}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto py-8 px-4">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}`;
    
    fs.writeFileSync(
      path.join(frontendDir, 'app', `layout.${fileExt}`),
      layoutContent
    );
    
    // Create providers file for wallet connection
    const providersContent = `${isTypescript ? "'use client';\n\nimport { ReactNode } from 'react';" : "'use client';\n"}
import { WagmiConfig, createConfig } from 'wagmi';
import { mainnet, rootstock, localhost } from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

const config = createConfig(
  getDefaultConfig({
    appName: 'Rootstock DApp',
    projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
    chains: [rootstock, localhost, mainnet],
  })
);

export function Providers({ children }${isTypescript ? ': { children: ReactNode }' : ''}) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}`;
    
    fs.writeFileSync(
      path.join(frontendDir, 'app', `providers.${fileExt}`),
      providersContent
    );
    
    // Create home page
    const homePageContent = `${isTypescript ? "'use client';\n" : "'use client';\n"}
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Rootstock DApp</h1>
      
      <div className="mb-8">
        <ConnectButton />
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex justify-center mb-4">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-center">Debug Contracts</h2>
          <p className="text-gray-600 mb-4">Tinker with your smart contract using the debug interface.</p>
          <a href="/debug-contracts" className="block text-center py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Debug Contracts
          </a>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex justify-center mb-4">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-center">Block Explorer</h2>
          <p className="text-gray-600 mb-4">Explore your local transactions with the block explorer.</p>
          <a href="/block-explorer" className="block text-center py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Block Explorer
          </a>
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-white rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
        <p className="mb-4">Edit your smart contract:</p>
        <div className="bg-gray-100 p-3 rounded font-mono text-sm mb-4">
          blockchain/contracts/RootstockToken.sol
        </div>
        
        <p className="mb-4">Edit your frontend:</p>
        <div className="bg-gray-100 p-3 rounded font-mono text-sm">
          frontend/app/page.${fileExt}
        </div>
      </div>
    </div>
  );
}`;
    
    fs.writeFileSync(
      path.join(frontendDir, 'app', `page.${fileExt}`),
      homePageContent
    );
    
    // Create debug contracts page
    const debugContractsContent = `${isTypescript ? "'use client';\n" : "'use client';\n"}
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useContract, useProvider, useSigner } from 'wagmi';
import { useState, useEffect } from 'react';

export default function DebugContracts() {
  const { address, isConnected } = useAccount();
  ${isTypescript ? "const [contractAddress, setContractAddress] = useState<string>('');" : "const [contractAddress, setContractAddress] = useState('');"}
  ${isTypescript ? "const [balance, setBalance] = useState<string>('');" : "const [balance, setBalance] = useState('');"}
  
  // In a real app, you would get the ABI from your deployed contract
  const tokenABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function transfer(address to, uint amount) returns (bool)"
  ];
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Debug Contracts</h1>
        <ConnectButton />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Contract Interaction</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Token Contract Address</label>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="0x8dbF326E12a9fF37ED6ddf75adA548c2640a6482"
            className="w-full p-2 border rounded"
          />
        </div>
        
        {isConnected ? (
          <div className="space-y-4">
            <button 
              className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => {
                // In a real app, you would query the contract here
                alert('Checking balance...');
              }}
            >
              Check Balance
            </button>
            
            {balance && (
              <div className="p-4 bg-gray-100 rounded">
                <p>Your balance: {balance}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
            Please connect your wallet to interact with contracts.
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Contract Info</h2>
        <p className="mb-2">Default Rootstock ERC20: <code className="bg-gray-100 px-2 py-1 rounded">0x8dbF326E12a9fF37ED6ddf75adA548c2640a6482</code></p>
        <p>To deploy your own token, run: <code className="bg-gray-100 px-2 py-1 rounded">npm run deploy</code></p>
      </div>
    </div>
  );
}`;
    
    fs.writeFileSync(
      path.join(frontendDir, 'app', 'debug-contracts', `page.${fileExt}`),
      debugContractsContent
    );
    
    // Create block explorer page
    const blockExplorerContent = `${isTypescript ? "'use client';\n" : "'use client';\n"}
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function BlockExplorer() {
  ${isTypescript ? "const [blockNumber, setBlockNumber] = useState<number | null>(null);" : "const [blockNumber, setBlockNumber] = useState(null);"}
  ${isTypescript ? "const [transactions, setTransactions] = useState<any[]>([]);" : "const [transactions, setTransactions] = useState([]);"}
  
  const fetchLatestBlock = async () => {
    // In a real app, you would fetch from the blockchain here
    setBlockNumber(12345);
    setTransactions([
      { hash: '0x123...', from: '0xabc...', to: '0xdef...', value: '1.2 ETH' },
      { hash: '0x456...', from: '0xghi...', to: '0xjkl...', value: '0.5 ETH' }
    ]);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Block Explorer</h1>
        <ConnectButton />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Latest Blocks</h2>
          <button 
            className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={fetchLatestBlock}
          >
            Refresh
          </button>
        </div>
        
        {blockNumber ? (
          <div>
            <p className="mb-4">Current Block: {blockNumber}</p>
            
            <h3 className="text-lg font-medium mb-2">Transactions</h3>
            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction Hash
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        From
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((tx, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {tx.hash}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tx.from}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tx.to}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tx.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No transactions found</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Click refresh to load the latest block data</p>
        )}
      </div>
    </div>
  );
}`;
    
    fs.writeFileSync(
      path.join(frontendDir, 'app', 'block-explorer', `page.${fileExt}`),
      blockExplorerContent
    );
    
  } else {
    // For React.js
    const srcDir = path.join(frontendDir, 'src');
    
    // Create components directory
    fs.mkdirSync(path.join(srcDir, 'components'), { recursive: true });
    fs.mkdirSync(path.join(srcDir, 'pages'), { recursive: true });
    
    // Update App.js/tsx
    const appContent = `${isTypescript ? "import React from 'react';\nimport { BrowserRouter as Router, Routes, Route } from 'react-router-dom';" : "import React from 'react';\nimport { BrowserRouter as Router, Routes, Route } from 'react-router-dom';"}
import { WagmiConfig, createConfig } from 'wagmi';
import { mainnet, rootstock, localhost } from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import DebugContracts from './pages/DebugContracts';
import BlockExplorer from './pages/BlockExplorer';
import './index.css';

const config = createConfig(
  getDefaultConfig({
    appName: 'Rootstock DApp',
    projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
    chains: [rootstock, localhost, mainnet],
  })
);

function App() {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto py-8 px-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/debug-contracts" element={<DebugContracts />} />
                <Route path="/block-explorer" element={<BlockExplorer />} />
              </Routes>
            </main>
          </div>
        </Router>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
`;
    
    fs.writeFileSync(
      path.join(srcDir, `App.${fileExt}`),
      appContent
    );
    
    // Create Navbar component
    const navbarContent = `${isTypescript ? "import React from 'react';\nimport { Link } from 'react-router-dom';" : "import React from 'react';\nimport { Link } from 'react-router-dom';"}
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="Logo" className="h-8 w-8 mr-2" />
            <span className="text-xl font-bold">Rootstock DApp</span>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/debug-contracts" className="text-gray-600 hover:text-blue-600 transition-colors">
              Debug Contracts
            </Link>
            <Link to="/block-explorer" className="text-gray-600 hover:text-blue-600 transition-colors">
              Block Explorer
            </Link>
          </div>
        </div>
        
        <ConnectButton />
      </div>
    </nav>
  );
};

export default Navbar;
`;
    
    fs.writeFileSync(
      path.join(srcDir, 'components', `Navbar.${fileExt}`),
      navbarContent
    );
    
    // Create Home page
    const homePageContent = `${isTypescript ? "import React from 'react';\nimport { Link } from 'react-router-dom';" : "import React from 'react';\nimport { Link } from 'react-router-dom';"}
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Rootstock DApp</h1>
      
      <div className="mb-8">
        <ConnectButton />
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex justify-center mb-4">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-center">Debug Contracts</h2>
          <p className="text-gray-600 mb-4">Tinker with your smart contract using the debug interface.</p>
          <Link to="/debug-contracts" className="block text-center py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Debug Contracts
          </Link>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex justify-center mb-4">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-center">Block Explorer</h2>
          <p className="text-gray-600 mb-4">Explore your local transactions with the block explorer.</p>
          <Link to="/block-explorer" className="block text-center py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Block Explorer
          </Link>
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-white rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
        <p className="mb-4">Edit your smart contract:</p>
        <div className="bg-gray-100 p-3 rounded font-mono text-sm mb-4">
          blockchain/contracts/RootstockToken.sol
        </div>
        
        <p className="mb-4">Edit your frontend:</p>
        <div className="bg-gray-100 p-3 rounded font-mono text-sm">
          frontend/src/pages/Home.${fileExt}
        </div>
      </div>
    </div>
  );
};

export default Home;
`;
    
    fs.writeFileSync(
      path.join(srcDir, 'pages', `Home.${fileExt}`),
      homePageContent
    );
    
    // Create DebugContracts page
    const debugContractsContent = `${isTypescript ? "import React, { useState, useEffect } from 'react';\nimport { useAccount } from 'wagmi';" : "import React, { useState, useEffect } from 'react';\nimport { useAccount } from 'wagmi';"}
import { ConnectButton } from '@rainbow-me/rainbowkit';

const DebugContracts = () => {
  const { address, isConnected } = useAccount();
  ${isTypescript ? "const [contractAddress, setContractAddress] = useState<string>('');" : "const [contractAddress, setContractAddress] = useState('');"}
  ${isTypescript ? "const [balance, setBalance] = useState<string>('');" : "const [balance, setBalance] = useState('');"}
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Debug Contracts</h1>
        <ConnectButton />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Contract Interaction</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Token Contract Address</label>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="0x8dbF326E12a9fF37ED6ddf75adA548c2640a6482"
            className="w-full p-2 border rounded"
          />
        </div>
        
        {isConnected ? (
          <div className="space-y-4">
            <button 
              className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => {
                // In a real app, you would query the contract here
                alert('Checking balance...');
              }}
            >
              Check Balance
            </button>
            
            {balance && (
              <div className="p-4 bg-gray-100 rounded">
                <p>Your balance: {balance}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
            Please connect your wallet to interact with contracts.
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Contract Info</h2>
        <p className="mb-2">Default Rootstock ERC20: <code className="bg-gray-100 px-2 py-1 rounded">0x8dbF326E12a9fF37ED6ddf75adA548c2640a6482</code></p>
        <p>To deploy your own token, run: <code className="bg-gray-100 px-2 py-1 rounded">npm run deploy</code></p>
      </div>
    </div>
  );
};

export default DebugContracts;
`;
    
    fs.writeFileSync(
      path.join(srcDir, 'pages', `DebugContracts.${fileExt}`),
      debugContractsContent
    );
    
    // Create BlockExplorer page
    const blockExplorerContent = `${isTypescript ? "import React, { useState } from 'react';" : "import React, { useState } from 'react';"}
import { ConnectButton } from '@rainbow-me/rainbowkit';

const BlockExplorer = () => {
  ${isTypescript ? "const [blockNumber, setBlockNumber] = useState<number | null>(null);" : "const [blockNumber, setBlockNumber] = useState(null);"}
  ${isTypescript ? "const [transactions, setTransactions] = useState<any[]>([]);" : "const [transactions, setTransactions] = useState([]);"}
  
  const fetchLatestBlock = async () => {
    // In a real app, you would fetch from the blockchain here
    setBlockNumber(12345);
    setTransactions([
      { hash: '0x123...', from: '0xabc...', to: '0xdef...', value: '1.2 ETH' },
      { hash: '0x456...', from: '0xghi...', to: '0xjkl...', value: '0.5 ETH' }
    ]);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Block Explorer</h1>
        <ConnectButton />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Latest Blocks</h2>
          <button 
            className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={fetchLatestBlock}
          >
            Refresh
          </button>
        </div>
        
        {blockNumber ? (
          <div>
            <p className="mb-4">Current Block: {blockNumber}</p>
            
            <h3 className="text-lg font-medium mb-2">Transactions</h3>
            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction Hash
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        From
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((tx, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {tx.hash}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tx.from}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tx.to}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tx.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No transactions found</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Click refresh to load the latest block data</p>
        )}
      </div>
    </div>
  );
};

export default BlockExplorer;
`;
    
    fs.writeFileSync(
      path.join(srcDir, 'pages', `BlockExplorer.${fileExt}`),
      blockExplorerContent
    );
    
    // Need to install react-router-dom
    execSync(`cd ${frontendDir} && npm install react-router-dom`, { stdio: 'ignore' });
  }
}

main();