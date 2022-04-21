/** @param {import(".").NS } ns */
export async function main(ns) {
	// // ns.tail();
	// var servers_list = ns.read('/text/server_list.txt').split(',');
	// // var servers_list = ns.getPurchasedServers();
	// var target_list = ns.read('/text/target_list.txt').split(',');
	// var current;
	// var max_ram;
	// var threads;
	// for (let i in servers_list) {
	// 	current = servers_list[i];
	// 	max_ram = ns.getServerMaxRam(current);
	// 	threads = Math.floor(max_ram / ns.getScriptRam('hack.js'));
	// 	if (threads > 0) {
	// 		var targets = target_list.toString();
	// 		var home_id = ns.exec('hack.js', current, threads, targets);
	// 		if (home_id > 0) {
	// 			ns.tprint("Started hack.js on server " + current);
	// 		}
	// 	}
	// }
	// // also execute on home
	// var home_max_ram = ns.getServerMaxRam('home');
	// var leave_free = 0;
	// var home_threads = Math.floor((home_max_ram - leave_free) / ns.getScriptRam('hack.js'));;
	// var home_id = ns.run('hack.js', home_threads, target_list.toString());
	// // var home_id = ns.run('hack.js', home_threads, 'harakiri-sushi');
	// if (home_id > 0) {
	// 	ns.tprint("Started hack.js on home server");
	// }

	ns.run('killswitch.js');
	await ns.sleep(1000);
	
	var server_list = ns.read('/text/server_list.txt').split(',');
	server_list.push('home');
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
		var threads = Math.floor(ns.getServerMaxRam(server) / ns.getScriptRam('hack.js'));

		ns.exec('hack.js', server, threads, target);
	}
}