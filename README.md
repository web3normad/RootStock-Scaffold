# RootStock Scaffold CLI Tool

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D14.x-brightgreen)
![NPM Version](https://img.shields.io/badge/npm-%3E%3D6.x-brightgreen)

A powerful CLI tool to scaffold Rootstock dApps with ease. Quickly set up a full-stack dApp with a customizable stack, including smart contracts, frontend frameworks, and blockchain interaction tools.

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## ✨ Features

- **Scaffold a Full-Stack dApp**: Quickly generate a dApp project with a customizable stack
- **Frontend Frameworks**: Choose between Next.js or React.js for your frontend
- **Programming Languages**: Use TypeScript or JavaScript for your project
- **Smart Contracts**: Automatically generate and deploy an ERC-20 token contract on Rootstock
- **Blockchain Interaction**: Integrated with Wagmi and RainbowKit for seamless wallet connection
- **Tailwind CSS**: Pre-configured with Tailwind CSS for rapid UI development
- **Hardhat Integration**: Built-in Hardhat configuration for smart contract development and testing

## 🚀 Installation

To use the RootStock Scaffold CLI tool, you need to have Node.js (>= 14.x) and npm (>= 6.x) installed on your machine.

### Install Globally via npm

```bash
npm install -g sila-scaffold-rootstock
```

### Install Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/web3normad/RootStock-Scaffold.git
   cd RootStock-Scaffold
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Link the package globally (for local development):
   ```bash
   npm link
   ```

## 🛠️ Usage

Once installed, you can use the CLI tool to scaffold a new Rootstock dApp project.

### Scaffold a New Project

Run the following command and follow the prompts:

```bash
create-rootstock-dapp
```

### CLI Prompts

- **Project Name**: Enter the name of your project
- **Frontend Framework**: Choose between Next.js or React.js
- **Programming Language**: Choose between TypeScript or JavaScript
- **Install Dependencies**: Choose whether to install dependencies automatically

### Running the Project

After scaffolding, navigate to your project directory and follow these steps:

1. Start the local blockchain:
   ```bash
   npm run blockchain
   ```

2. Deploy your smart contracts:
   ```bash
   npm run deploy
   ```

3. Start the frontend:
   ```bash
   npm run frontend
   ```

## 📁 Project Structure

The scaffolded project will have the following structure:

```
my-rootstock-dapp/
├── blockchain/               # Smart contract development
│   ├── contracts/            # Solidity contracts
│   ├── scripts/              # Deployment scripts
│   ├── test/                 # Smart contract tests
│   └── hardhat.config.js     # Hardhat configuration
├── frontend/                 # Frontend application
│   ├── public/               # Static assets
│   ├── src/                  # Application source code
│   └── tailwind.config.js    # Tailwind CSS configuration
├── package.json              # Project dependencies and scripts
└── README.md                 # Project documentation
```

## 🔧 Technologies Used

- **Frontend**: Next.js, React.js, Tailwind CSS
- **Blockchain**: Rootstock, Hardhat, Solidity
- **Wallet Integration**: Wagmi, RainbowKit
- **CLI Tools**: Commander, Inquirer, Chalk, ShellJS

## 👥 Contributing

We welcome contributions! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## 📄 License

This project is licensed under the ISC License. See the LICENSE file for details.

## 🤝 Support

If you encounter any issues or have questions, feel free to:
- Open an issue on GitHub
- Reach out to the maintainer at dojiemma@gmail.com

## 🙏 Acknowledgments

- Inspired by Scaffold-ETH
- Built with ❤️ by Emmanuel Doji
