/** @param {import(".").NS } ns */
export async function main(ns) {
	ns.run('killswitch.js');
	await ns.sleep(1000);

	ns.tprint("Running batch scripts...");

	var droids_list = ns.getPurchasedServers();
	var hacknet_list = ns.read('/text/hacknet_nodes_list.txt').split(',');
	var servers_list = [];
	if (droids_list.length > 0 && hacknet_list.length == 0) {
		servers_list = droids_list;
	}
	if (droids_list.length == 0 && hacknet_list.length > 0) {
		servers_list = hacknet_list;
	}
	if (droids_list.length > 0 && hacknet_list.length > 0) {
		servers_list = droid_list.concat(hacknet_list);
	}
	servers_list.push('home');

	var target_list = ns.read('/text/new_target_list.txt').split(',');
	var iter_list;
	// adding one to account for home
	if (servers_list.length + 1 <= target_list.length) {
		iter_list = servers_list;
	} else {
		iter_list = target_list;
	}
	for (let i in iter_list) {
		var server = servers_list[i];
		var target = target_list[i];
		ns.run('batch.js', 1, server, target, Math.random());
	}
}