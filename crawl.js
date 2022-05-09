/** @param {import(".").NS } ns */
export async function main(ns) {

	const data = ns.flags([['tail', false]]);

	if (data['tail']) {
		ns.tail();
	}
	ns.disableLog('ALL');
	ns.clearLog();

	// map all servers, except hacknet servers, purchased (droids), and darkweb
	async function serverMap(scan_list, depth, server_list) {
		var droid_list = ns.getPurchasedServers();

		// removes parent from array, but only if not level 1
		if (depth > 1) {
			scan_list.shift();
		}

		// get port opening capability
		var port = 0;
		if (ns.fileExists('BruteSSH.exe')) {
			port++;
		}
		if (ns.fileExists('FTPCrack.exe')) {
			port++;
		}
		if (ns.fileExists('relaySMTP.exe')) {
			port++;
		}
		if (ns.fileExists('HTTPWorm.exe')) {
			port++;
		}
		if (ns.fileExists('SQLInject.exe')) {
			port++;
		}

		if (scan_list.length > 0) {
			for (let i in scan_list) {
				var current = scan_list[i];
				// nuking only requires enough ports to be opened
				if (ns.getServerNumPortsRequired(current) <= port &&
					!ns.hasRootAccess(current)
				) {
					if (ns.fileExists('BruteSSH.exe')) {
						ns.brutessh(current);
					}
					if (ns.fileExists('FTPCrack.exe')) {
						ns.ftpcrack(current);
					}
					if (ns.fileExists('relaySMTP.exe')) {
						ns.relaysmtp(current);
					}
					if (ns.fileExists('HTTPWorm.exe')) {
						ns.httpworm(current);
					}
					if (ns.fileExists('SQLInject.exe')) {
						ns.sqlinject(current);
					}
					ns.nuke(current);
				}

				// 
				// if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(current) &&
				// 	!ns.getServer(current).backdoorInstalled) {
				// 	ns.singularity.connect(current);
				// 	await ns.singularity.installBackdoor();
				// }

				

				if (ns.hasRootAccess(current) &&
					!droid_list.includes(current) &&
					!current.includes('darkweb') &&
					!current.includes('hacknet')) {
					// only include in printed crawl if not hacknet node
					var server_string = ' '.repeat(depth) + '╚-' + current;

					var file_list = ns.ls(current);
					for (let i in file_list) {
						var current_file = file_list[i];
						if (current_file.includes('.cct')) {
							server_string += '\uD83D\uDFE6'; // blue square
						}
					}

					if (['CSEC', 'avmnite-02h', 'I.I.I.I', 'run4theh111z', 'The-Cave'].includes(current)) {
						if (ns.getPlayer().hacking < ns.getServerRequiredHackingLevel(current)) {
							server_string += '\uD83D\uDFE5'; // red square
						} else if (!ns.getServer(current).backdoorInstalled) {
							server_string += '\uD83D\uDFE8'; // yellow square
						} else {
							server_string += '\uD83D\uDFE9'; // green square
						}
					}

					ns.print(server_string);
					server_list.push(current);

					await serverMap(ns.scan(current), depth + 1, server_list);
				}
			}
		}
		return server_list;
	}

	ns.tprint("Getting server list...");

	var big_list = [];
	var big_list = await serverMap(ns.scan('home'), 1, big_list);

	var target_list = [];
	for (let i in big_list) {
		// only build target list with servers that are hackable with money > $0
		var current = big_list[i];
		if (ns.getServerMoneyAvailable(current) > 0 && ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(current)) {
			target_list.push(current);
		}
	}

	var server_list = [];
	var desired_threads = 1;
	for (let i in big_list) {
		// only run script from servers with sufficient RAM and with root access
		var current = big_list[i];
		if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(current) &&
			ns.getServerMaxRam(current) > (ns.getScriptRam('hack.js') * desired_threads)) {
			server_list.push(current);
		}
	}

	var hacknet_server_list = [];
	var home_scan = ns.scan('home');
	for (let i in home_scan) {
		var current = home_scan[i];
		if (current.includes('hacknet')) {
			hacknet_server_list.push(current);
		}
	}

	if (ns.args.length == 0) {
		var current_time = new Date();
		current_time.getDate();
		current_time.getTime();
		ns.print('\nCrawl timestamp: ' + current_time.toLocaleString('en-US').toString());
	} else {
		ns.print('\nCrawl timestamp: ' + ns.args[0]);
	}

	await ns.write('/text/all_servers.txt', big_list, 'w');
	await ns.write('/text/server_list.txt', server_list, 'w');
	await ns.write('/text/target_list.txt', target_list, 'w');
	await ns.write('/text/hacknet_nodes_list.txt', hacknet_server_list, 'w');

	ns.run('refineTargets.js');
	ns.run('copyScript.js');

	ns.tprint("Target count: " + target_list.length);
	ns.tprint("Server count: " + server_list.length);
	ns.tprint("Droid count: " + ns.getPurchasedServers().length);
	ns.tprint("Hacknet Server count: " + hacknet_server_list.length);
}