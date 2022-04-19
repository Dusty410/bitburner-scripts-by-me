/** @param {NS} ns */
export async function main(ns) {
	ns.run('killswitch.js');
	await ns.sleep(1000);

	ns.tprint("Deploying hacking scripts...");

	var server_list = ns.getPurchasedServers();
	// var server_list = ns.read('/text/server_list.txt').split(',');
	server_list.push('home');
	// var target_list = ns.read('/text/target_list.txt').split(',');
	var target_list = ns.read('/text/new_target_list.txt').split(',');
	var iter_list;
	// adding one to account for home
	if (server_list.length + 1 <= target_list.length) {
		iter_list = server_list;
	} else {
		iter_list = target_list;
	}
	for (let i in iter_list) {
		var server = server_list[i];
		var target = target_list[i];
		ns.run('batch.js', 1, server, target, Math.random());
	}
}