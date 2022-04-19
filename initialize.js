/** @param {NS} ns */
export async function main(ns) {
	var target_list = ns.read('/text/target_list.txt').split(',');
	var droid_list = ns.getPurchasedServers();
	var free_ram = ns.getServerMaxRam('home') - ns.getScriptRam('initialize.js') - ns.getScriptRam('expand.js') - (ns.getScriptRam('batch.js') * droid_list.length);
	var weaken_threads = Math.floor(free_ram / ns.getScriptRam('weaken.js'));
	var grow_threads = Math.floor(free_ram / ns.getScriptRam('grow.js'));
	for (let i in target_list) {
		var target = target_list[i];
		while (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) || ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
			if (!ns.scriptRunning('weaken.js', 'home') && !ns.scriptRunning('grow.js', 'home')) {
				ns.run('weaken.js', weaken_threads, target, 0);
			}
			if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
				if (!ns.scriptRunning('grow.js', 'home') && !ns.scriptRunning('weaken.js', 'home')) {
					ns.run('grow.js', grow_threads, target, 0);
				}
			}
			await ns.sleep(200);
		}
	}
}