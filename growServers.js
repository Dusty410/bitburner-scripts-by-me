/** @param {NS} ns */
export async function main(ns) {
	async function GrowServers(min_level) {
		var droid_list = ns.getPurchasedServers();
		var droid_limit = ns.getPurchasedServerLimit();

		while(true) {	
			if (droid_list.length < droid_limit) {
				if (ns.getPurchasedServerCost(2**min_level) < ns.getServerMoneyAvailable('home')) {
					while (ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(2**(min_level+1))) {
						min_level++;
					}
					// buy it
					var server_name = ns.purchaseServer("droid", (2**min_level));
					ns.tprint("Bought " + server_name + ", RAM " + ns.getServerMaxRam(server_name) + ", level " + min_level);
					// depoy it
					ns.run('killswitch.js');
					await ns.sleep(1000);
					ns.run('crawl.js');
					await ns.sleep(1000);
					ns.run('copyScript.js');
					await ns.sleep(1000);
					ns.run('execHack.js');
				} else {
					ns.tprint("Level " + min_level + " is too expensive!");
					ns.tprint("You need $" + Intl.NumberFormat('en-US').format(ns.getPurchasedServerCost(2**min_level)));
				}
			} else {
				// delete the lowest ram server
				var max_ram = ns.getPurchasedServerMaxRam()
				var lowest_ram = max_ram;
				var lowest_ram_droid;
				var max_owned_ram;

				// find lowest ram
				for (let i in droid_list) {
					var current = droid_list[i];
					var current_ram = ns.getServerMaxRam(current);
					if (current_ram < lowest_ram) {
						lowest_ram = current_ram;
						lowest_ram_droid = current;
					}
				}

				// find highest ram
				for (let i in droid_list) {
					var current = droid_list[i];
					var current_ram = ns.getServerMaxRam(current);
					if (current_ram > max_owned_ram) {
						max_owned_ram = current_ram;
					}
				}

				if (lowest_ram == max_ram) {
					ns.tprint("Purchased servers maxed out.");
					break;
				} else if (lowest_ram == max_owned_ram) {
					ns.tprint("Bought all servers at level " + min_level + ", increasing min level.");
					min_level++;
				} else {
					ns.deleteServer(lowest_ram_droid);
				}
			}
			// wait 5 minutes until next check
			await ns.sleep(300000);
		}
	}

	await GrowServers(ns.args[0]);
}

/**
serverPrices.js: 1 GiB RAM costs: $55,000, level 0
serverPrices.js: 2 GiB RAM costs: $110,000, level 1
serverPrices.js: 4 GiB RAM costs: $220,000, level 2
serverPrices.js: 8 GiB RAM costs: $440,000, level 3
serverPrices.js: 16 GiB RAM costs: $880,000, level 4
serverPrices.js: 32 GiB RAM costs: $1,760,000, level 5
serverPrices.js: 64 GiB RAM costs: $3,520,000, level 6
serverPrices.js: 128 GiB RAM costs: $7,040,000, level 7
serverPrices.js: 256 GiB RAM costs: $14,080,000, level 8
serverPrices.js: 512 GiB RAM costs: $28,160,000, level 9
serverPrices.js: 1024 GiB RAM costs: $56,320,000, level 10
serverPrices.js: 2048 GiB RAM costs: $112,640,000, level 11
serverPrices.js: 4096 GiB RAM costs: $225,280,000, level 12
serverPrices.js: 8192 GiB RAM costs: $450,560,000, level 13
serverPrices.js: 16384 GiB RAM costs: $901,120,000, level 14
serverPrices.js: 32768 GiB RAM costs: $1,802,240,000, level 15
serverPrices.js: 65536 GiB RAM costs: $3,604,480,000, level 16
serverPrices.js: 131072 GiB RAM costs: $7,208,960,000, level 17
serverPrices.js: 262144 GiB RAM costs: $14,417,920,000, level 18
serverPrices.js: 524288 GiB RAM costs: $28,835,840,000, level 19
serverPrices.js: 1048576 GiB RAM costs: $57,671,680,000, level 20
*/