/** @param {NS} ns */
export async function main(ns) {
	// ns.tail();
	ns.disableLog('ALL');
	ns.clearLog();

	ns.tprint("Killing all scripts...");

	var server_list = ns.read('/text/server_list.txt').split(',');
	server_list = server_list.concat(ns.getPurchasedServers());
	for (let i in server_list) {
		var current = server_list[i];
		ns.killall(current);
		// var processes = ns.ps(current);
		// if (processes.length > 0) {
		// 	for (let j in processes) {
		// 		var current_process = processes[j];
		// 		if (current_process.filename == 'hack.js') {
		// 			if (ns.kill(current_process.pid)) {
		// 				ns.tprint('Killed hack.js on ' + current + '.');
		// 			}
		// 		}
				// if (current_process.filename == 'hackv2.js') {
				// 	if (ns.kill(current_process.pid)) {
				// 		ns.tprint('Killed hackv2.js on ' + current + '.');
				// 	}
				// }
				// if (current_process.filename == 'grow.js') {
				// 	if (ns.kill(current_process.pid)) {
				// 		ns.tprint('Killed grow.js on ' + current + '.');
				// 	}
				// }
				// if (current_process.filename == 'weaken.js') {
				// 	if (ns.kill(current_process.pid)) {
				// 		ns.tprint('Killed weaken.js on ' + current + '.');
				// 	}
				// }
		// 	}
		// }
	}
	
	// make sure to kill the home server too
	var home_processes = ns.ps('home');
	if (home_processes.length > 0) {
		for (let i in home_processes) {
			var current_home_process = home_processes[i];
			// if (current_home_process.filename == 'hack.js') {
			// 	if (ns.kill(current_home_process.pid)) {
			// 		ns.tprint('Killed hack.js on home.');
			// 	}
			// }
			if (current_home_process.filename == 'batch.js') {
				if (ns.kill(current_home_process.pid)) {
					ns.print('Killed batch.js on home.');
				}
			}
			if (current_home_process.filename == 'hackv2.js') {
				if (ns.kill(current_home_process.pid)) {
					ns.print('Killed hackv2.js on home.');
				}
			}
			if (current_home_process.filename == 'grow.js') {
				if (ns.kill(current_home_process.pid)) {
					ns.print('Killed grow.js on home.');
				}
			}
			if (current_home_process.filename == 'weaken.js') {
				if (ns.kill(current_home_process.pid)) {
					ns.print('Killed weaken.js on home.');
				}
			}
			if (current_home_process.filename == 'initv2.js') {
				if (ns.kill(current_home_process.pid)) {
					ns.print('Killed initv2.js on home.');
				}
			}
			if (current_home_process.filename == 'share.js') {
				if (ns.kill(current_home_process.pid)) {
					ns.print('Killed initv2.js on home.');
				}
			}
			// if (current_home_process.filename == 'hackv2.js') {
			// 	if (ns.kill(current_home_process.pid)) {
			// 		ns.tprint('Killed hackv2.js on home.');
			// 	}
			// }
			// if (current_home_process.filename == 'grow.js') {
			// 	if (ns.kill(current_home_process.pid)) {
			// 		ns.tprint('Killed grow.js on home.');
			// 	}
			// }
			// if (current_home_process.filename == 'weaken.js') {
			// 	if (ns.kill(current_home_process.pid)) {
			// 		ns.tprint('Killed weaken.js on home.');
			// 	}
			// }
		}
	}
}