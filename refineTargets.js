/** @param {import(".").NS } ns */
export async function main(ns) {
	// ns.tail();
	ns.disableLog('ALL');
	ns.clearLog();

	ns.tprint("Refining target list...");

	var target_list = ns.read('/text/target_list.txt').split(',');
	var refined_targets = [];
	var new_target_list = [];
	for (let i in target_list) {
		var target = target_list[i];
		var target_max_money = ns.getServerMaxMoney(target);
		var target_min_sec = ns.getServerMinSecurityLevel(target);
		refined_targets.push({server:target, max_money:target_max_money});
	}
	refined_targets.sort(function(a, b){return a.max_money - b.max_money});
	// create an array of just target names, but now they'll be in order from least money to most
	for (let i in refined_targets) {
		new_target_list.push(refined_targets[i].server);
	}
	// for printing
	// for (let i in refined_targets) {
	// 	ns.tprint((refined_targets[i].server + ": ").padEnd(20, ' ') + refined_targets[i].max_money + "\n");
	// }
	ns.print(new_target_list);
	ns.tprint("Refined target count: " + new_target_list.length);
	await ns.write('/text/new_target_list.txt', new_target_list, 'w');

	// var new_list = [];
	// var file_list = ns.read('refined_targets.txt').split(',');
	// ns.tprint(file_list);
	// for (let i in file_list) {
	// 	var file_object = JSON.parse(file_list[i]);
	// 	new_list.push(file_object);
	// }
	// new_list.sort(function(a, b){return a.max_money - b.max_money});
	// ns.tprint(new_list);

}