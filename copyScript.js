/** @param {NS} ns */
export async function main(ns) {
	// ns.tail();
	ns.disableLog('ALL');
	ns.clearLog();

	ns.tprint("Copying scripts...");

	var servers_list = ns.read('/text/server_list.txt').split(',');
	servers_list = servers_list.concat(ns.getPurchasedServers());
	var copy_count = 0;
	for (let i in servers_list) {
		var server = servers_list[i];
		if (ns.hasRootAccess(server)) {
			if (
				await ns.scp("hackv2.js", server) &&
				await ns.scp("grow.js", server) &&
				await ns.scp("weaken.js", server) &&
				await ns.scp("initv2.js", server) &&
				await ns.scp("share.js", server) &&
				await ns.scp("hack.js", server)
			) {
				ns.print("Copied scripts to " + server);
				copy_count++;
			}
		}
	}
	ns.print("Successfully copied scripts to " + copy_count + " servers.");
}