type Network = 'mainnet' | 'testnet';

export const CONFIG = {
	POLLING_INTERVAL_MS: 1000,
	DEFAULT_LIMIT: 50,
	NETWORK: (process.env.NETWORK as Network) || 'testnet',
	BLUETUNE_PACKAGE_ID: "0x7c1e1c12dd055b840224754b7775a78501423bf74a929e2b783e197bfe396dfa"
};
