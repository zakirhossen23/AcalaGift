
// Just a standard hardhat-deploy deployment definition file!
const func = async (hre) => {
	const { deployments, getNamedAccounts } = hre;
	const { deploy } = deployments;
	const { deployer } = await getNamedAccounts();

	const name = 'aUSD';
	const symbol = 'aUSD';

	await deploy('MoonbeamERC721', {
		from: deployer,
		args: [name, symbol],
		log: true,
	});
};

func.tags = ['aUSD'];
module.exports = func;