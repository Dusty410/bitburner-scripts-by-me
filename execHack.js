/** @param {import(".").NS } ns */
export async function main(ns) {
	ns.run('killswitch.js');
	await ns.sleep(1000);
	
	var server_list = ns.read('/text/zombieList.txt').split(',');
	server_list.push('home');
	var target_list = ns.read('/text/targetList.txt').split(',');
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