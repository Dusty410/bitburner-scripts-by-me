/** @param {NS} ns */
export async function main(ns) {

	const data = ns.flags([['tail', false]]);

	if (data['tail']) {
		ns.tail();
	}
	ns.disableLog('ALL');
	ns.clearLog();

	function serverMap(scan_list, depth, server_list) {
		var current;
		var droid_list = ns.getPurchasedServers();

		// removes parent from array, but only if not level 1
		if (depth > 1) {
			scan_list.shift();
		}

		// get port open capability
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
				current = scan_list[i];
				if (!(ns.hasRootAccess(current))) {
					if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(current) && ns.getServerNumPortsRequired(current) <= port) {
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
				}

				if (ns.hasRootAccess(current) && !droid_list.includes(current) && !'darkweb'.includes(current)) {
					// if (ns.getServerMaxMoney(current) > 0) {
					var current_money = Math.floor(ns.getServerMoneyAvailable(current));
					var current_money_formatted = "$" + Intl.NumberFormat('en-US').format(current_money);
					var max_money = Math.floor(ns.getServerMaxMoney(current));
					var max_money_format = "$" + Intl.NumberFormat('en-US').format(max_money);
					var pad = 16;
					var max_ram = ns.getServerMaxRam(current);
					var current_sec = ns.getServerSecurityLevel(current);
					var min_sec = ns.getServerMinSecurityLevel(current);
					var hack_chance = ns.hackAnalyzeChance(current) * 100;

					var server_string = ' '.repeat(depth) + '╚-' + current;
					// ns.tprint("current: ".padStart(pad, ' ') + current_money_formatted.padStart(pad, ' ') + ' (' + Math.floor((current_money/max_money)*100) + '%)');
					// ns.tprint("max: ".padStart(pad, ' ') + max_money_format.padStart(pad, ' '));
					// ns.tprint("current sec: ".padStart(pad, ' ') + current_sec);
					// ns.tprint("min sec: ".padStart(pad, ' ') + min_sec);
					// ns.tprint("hack threads: ".padStart(pad, ' ') + threads);
					// ns.tprint("hack: ".padStart(pad, ' ') + Math.floor(hack_chance) + '%');

					var file_list = ns.ls(current);
					for (let i in file_list) {
						var current_file = file_list[i];
						if (current_file.includes('.cct')) {
							server_string += '\uD83D\uDFE6';
						}
					}

					if (['CSEC', 'avmnite-02h', 'I.I.I.I', 'run4theh111z', 'The-Cave'].includes(current)) {
						if (ns.getPlayer().hacking < ns.getServerRequiredHackingLevel(current)) {
							server_string += '\uD83D\uDFE5'; // red square
						} else if (!ns.getServer(current).backdoorInstalled) {
							server_string += '\uD83D\uDFE8';
						} else {
							server_string += '\uD83D\uDFE9';
						}

					}
					// ns.print('\n');
					// }
					ns.print(server_string);
					server_list.push(current);
					serverMap(ns.scan(current), depth + 1, server_list);
				}
			}
		}
		return server_list;
	}

	ns.tprint("Getting server list...");

	var big_list = [];
	var big_list = serverMap(ns.scan('home'), 1, big_list);

	var target_list = [];
	for (let i in big_list) {
		// only build target list with servers with non 0 money
		if (!(ns.getServerMoneyAvailable(big_list[i]) == 0)) {
			target_list.push(big_list[i]);
		}
	}

	var server_list = [];
	var desired_threads = 1;
	for (let i in big_list) {
		// only run script from servers with sufficient RAM
		if (ns.getServerMaxRam(big_list[i]) > (ns.getScriptRam('hack.js') * desired_threads)) {
			server_list.push(big_list[i]);
		}
	}

	ns.print('\nCrawl timestamp: ' + ns.args[0]);

	await ns.write('/text/all_servers.txt', big_list, 'w');
	await ns.write('/text/server_list.txt', server_list, 'w');
	await ns.write('/text/target_list.txt', target_list, 'w');

	ns.tprint("Target count: " + target_list.length);
	ns.tprint("Server count: " + server_list.length);
}