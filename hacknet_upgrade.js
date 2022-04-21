/** @param {import(".").NS } ns */
export async function main(ns) {
	while(true) {
		// build current list of hacknet servers
		var hacknet_servers = [];
		var local_servers = ns.scan('home');
		for (let i in local_servers) {
			var current = local_servers[i];
			if (current.includes('hacknet')) {
				hacknet_servers.push(current);
			}
		}

		// buy as many hacknet servers as i can afford
		while (ns.getServerMoneyAvailable('home') > ns.hacknet.getPurchaseNodeCost()) {
			ns.hacknet.purchaseNode();
		}

		// loop through each node, upgrade cheapest i can afford
		for (let current in hacknet_servers) {
			while (ns.getServerMoneyAvailable('home') > ns.hacknet.getLevelUpgradeCost(current, 1)) {
				ns.hacknet.upgradeLevel(current, 1);
			}

			while (ns.getServerMoneyAvailable('home') > ns.hacknet.getRamUpgradeCost(current, 1)) {
				ns.hacknet.upgradeRam(current, 1);
			}

			while (ns.getServerMoneyAvailable('home') > ns.hacknet.getCoreUpgradeCost(current, 1)) {
				ns.hacknet.upgradeCore(current, 1);
			}

			while (ns.getServerMoneyAvailable('home') > ns.hacknet.getCacheUpgradeCost(current, 1)) {
				ns.hacknet.upgradeCache(current, 1);
			}
		}

		await ns.sleep(25);
	}
}