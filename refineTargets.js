/** @param {import(".").NS } ns */
export async function main(ns) {
	ns.tprint("Refining target list...");

	var target_list = ns.read('/text/target_list.txt').split(',');
	var refined_targets = [];
	var new_target_list = [];
	for (let i in target_list) {
		var target = target_list[i];
		// var target_max_money = ns.getServerMaxMoney(target);
		var target_min_sec = ns.getServerMinSecurityLevel(target);
		refined_targets.push({server:target, min_sec:target_min_sec});
	}
	refined_targets.sort(function(a, b){return a.min_sec - b.min_sec});
	// create an array of just target names, but now they'll be in order from least money to most
	for (let i in refined_targets) {
		new_target_list.push(refined_targets[i].server);
	}

	ns.print(new_target_list);
	// ns.tprint("Refined target count: " + new_target_list.length);
	await ns.write('/text/new_target_list.txt', new_target_list, 'w');
}