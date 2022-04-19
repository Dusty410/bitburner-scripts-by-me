/** @param {NS} ns */
export async function main(ns) {

	async function BuyServer(droid_level) {
		if (ns.getPurchasedServerCost(2 ** droid_level) < ns.getServerMoneyAvailable('home')) {
			// buy it
			var server_name = ns.purchaseServer("droid", (2 ** droid_level));
			ns.tprint("Bought " + server_name + ", RAM " + ns.getServerMaxRam(server_name) + ", level " + droid_level);
			// deploy it
			ns.run('killswitch.js');
			await ns.sleep(1000);
			var current_time = new Date();
			current_time.getDate();
			current_time.getTime();
			ns.run('crawl.js', 1, current_time.toLocaleString('en-US').toString());
			await ns.sleep(1000);
			ns.run('refineTargets.js');
			await ns.sleep(1000);
			ns.run('copyScript.js');
			await ns.sleep(1000);
			ns.run('execBatch.js');
			return true;
		} else {
			ns.tprint("Level " + droid_level + " is too expensive!");
			ns.tprint("You need $" + Intl.NumberFormat('en-US').format(ns.getPurchasedServerCost(2 ** droid_level)));
			return false;
		}
	}

	async function GrowServers(droid_level) {
		while (true) {
			var droid_list = ns.getPurchasedServers();
			var droid_limit = ns.getPurchasedServerLimit();

			// make min_level the highest i own
			if (droid_list.length > 0) {
				var highest_owned_ram = 0;
				for (let i in droid_list) {
					var current = droid_list[i];
					var current_ram = ns.getServerMaxRam(current);
					if (current_ram > highest_owned_ram) {
						highest_owned_ram = current_ram;
					}
				}
				droid_level = Math.log2(highest_owned_ram);
			}

			// make min level the highest I can afford, don't go higher than level 20
			while (ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(2 ** (droid_level + 1)) && droid_level < 20) {
				droid_level++;
			}

			// if i have room, buy as many as i can afford
			while (droid_list.length < droid_limit && await BuyServer(droid_level)) {
			}
			
			// if droids are at capacity, determine if i can upgrade 1
			if (droid_list.length == droid_limit) {
				var max_possible_ram = ns.getPurchasedServerMaxRam()
				var lowest_ram = max_possible_ram;
				var lowest_ram_droid;
				var max_owned_ram = 0;
				var max_ram_droid;

				// find lowest ram
				for (let i in droid_list) {
					var current = droid_list[i];
					var current_ram = ns.getServerMaxRam(current);
					if (current_ram < lowest_ram) {
						lowest_ram = current_ram;
						lowest_ram_droid = current;
					}
				}
				ns.tprint("Lowest RAM droid is " + lowest_ram_droid + " with RAM " + lowest_ram);

				// find highest ram
				for (let i in droid_list) {
					var current = droid_list[i];
					var current_ram = ns.getServerMaxRam(current);
					if (current_ram > max_owned_ram) {
						max_owned_ram = current_ram;
						max_ram_droid = current;
					}
				}
				ns.tprint("Highest RAM droid is " + max_ram_droid + " with RAM " + max_owned_ram);

				// break if we've bought all possible max level droids
				if (lowest_ram == max_possible_ram) {
					ns.tprint("Purchased droids maxed out.");
					break;
					// else delete one to make room for a more powerful droid
				} else {
					// increase droid level if they're all the same
					if (lowest_ram == max_owned_ram && Math.log2(max_owned_ram) == droid_level) {
						ns.tprint("Bought all droids at level " + droid_level + ", increasing min level.");
						droid_level++;
					}
					// only delete server if we can afford new one
					if (ns.getPurchasedServerCost(2 ** droid_level) < ns.getServerMoneyAvailable('home')) {
						ns.killall(lowest_ram_droid);
						if (ns.deleteServer(lowest_ram_droid)) {
							ns.tprint("Succesfully deleted " + lowest_ram_droid);
							await BuyServer(droid_level);
						}
					} else {
						ns.tprint("No droids deleted, level " + droid_level + " is too expensive!");
						ns.tprint("You need $" + Intl.NumberFormat('en-US').format(ns.getPurchasedServerCost(2 ** droid_level)));
					}
				}
			}
			// wait 1 minute until next check
			await ns.sleep(60000);
		}
	}

	var min_level = 6;
	await GrowServers(min_level);
}

/**
Server prices on bn1:
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