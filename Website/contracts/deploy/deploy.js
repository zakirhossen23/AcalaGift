
// Just a standard hardhat-deploy deployment definition file!
const func = async (hre) => {
	const { deployments, getNamedAccounts } = hre;
	const { deploy } = deployments;
	const { deployer } = await getNamedAccounts();

	const name = 'cEUR';
	const symbol = 'cEUR';

	await deploy('CeloERC721', {
		from: deployer,
		args: [name, symbol],
		log: true,
	});
};

func.tags = ['cEUR'];
module.exports = func;