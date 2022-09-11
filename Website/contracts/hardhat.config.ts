import * as dotenv from 'dotenv';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-deploy';
dotenv.config();

module.exports = {
	//Specifing Acala16 Testnet network for smart contract deploying
	networks: {
		celo_alfajores: {
			url: "https://alfajores-forno.celo-testnet.org",
			accounts: [`19d8ab05361101352c8580f49fa90d4882969aaf45432aa2eeff2f9cfea38009`],
			chainId: 44787,
			gasPrice: 1000000000
		  }	
	},
	//Specifing Solidity compiler version
	solidity: {
		compilers: [
			{
				version: '0.7.6',
			},
			{
				version: '0.8.6',
			},
		],
	},
	//Specifing Account to choose for deploying
	namedAccounts: {
		deployer: 0,
	},
};