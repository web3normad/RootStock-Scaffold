RootStock Scaffold CLI Tool
License
Node Version
NPM Version

A powerful CLI tool to scaffold Rootstock dApps with ease. Quickly set up a full-stack dApp with a customizable stack, including smart contracts, frontend frameworks, and blockchain interaction tools.

Table of Contents
Features

Installation

Usage

Project Structure

Technologies Used

Contributing

License

Support

Features
Scaffold a Full-Stack dApp: Quickly generate a dApp project with a customizable stack.

Frontend Frameworks: Choose between Next.js or React.js for your frontend.

Programming Languages: Use TypeScript or JavaScript for your project.

Smart Contracts: Automatically generate and deploy an ERC-20 token contract on Rootstock.

Blockchain Interaction: Integrated with Wagmi and RainbowKit for seamless wallet connection and blockchain interaction.

Tailwind CSS: Pre-configured with Tailwind CSS for rapid UI development.

Hardhat Integration: Built-in Hardhat configuration for smart contract development and testing.

Installation
To use the RootStock Scaffold CLI tool, you need to have Node.js (>= 14.x) and npm (>= 6.x) installed on your machine.

Install Globally via npm
bash
Copy
npm install -g sila-scaffold-rootstock
Install Locally
Clone the repository:

bash
Copy
git clone https://github.com/web3normad/RootStock-Scaffold.git
cd RootStock-Scaffold
Install dependencies:

bash
Copy
npm install
Link the package globally (for local development):

bash
Copy
npm link
Usage
Once installed, you can use the CLI tool to scaffold a new Rootstock dApp project.

Scaffold a New Project
Run the following command and follow the prompts:

bash
Copy
create-rootstock-dapp
CLI Prompts
Project Name: Enter the name of your project.

Frontend Framework: Choose between Next.js or React.js.

Programming Language: Choose between TypeScript or JavaScript.

Install Dependencies: Choose whether to install dependencies automatically.

Running the Project
After scaffolding, navigate to your project directory and follow these steps:

Start the local blockchain:

bash
Copy
npm run blockchain
Deploy your smart contracts:

bash
Copy
npm run deploy
Start the frontend:

bash
Copy
npm run frontend
Project Structure
The scaffolded project will have the following structure:

Copy
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
Technologies Used
Frontend: Next.js, React.js, Tailwind CSS

Blockchain: Rootstock, Hardhat, Solidity

Wallet Integration: Wagmi, RainbowKit

CLI Tools: Commander, Inquirer, Chalk, ShellJS

Contributing
We welcome contributions! If you'd like to contribute to this project, please follow these steps:

Fork the repository.

Create a new branch:

bash
Copy
git checkout -b feature/your-feature-name
Make your changes and commit them:

bash
Copy
git commit -m "Add your feature"
Push to the branch:

bash
Copy
git push origin feature/your-feature-name
Open a pull request.

Please ensure your code follows the project's coding standards and includes appropriate tests.

License
This project is licensed under the ISC License. See the LICENSE file for details.

Support
If you encounter any issues or have questions, feel free to:

Open an issue on GitHub.

Reach out to the maintainer at your.email@example.com.

Acknowledgments
Inspired by Scaffold-ETH.

Built with ❤️ by Emmanuel Doji.
