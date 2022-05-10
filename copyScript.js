/** @param {import(".").NS } ns */
export async function main(ns) {
	// ns.tail();
	// ns.disableLog('ALL');
	// ns.clearLog();

	ns.tprint(
		"Copying scripts..."
	);

	var serversList = ns.read('/text/zombieList.txt').split(',');
	serversList = serversList.concat(ns.getPurchasedServers());
	var copyCount = 0;
	for (let i in serversList) {
		var server = serversList[i];
		if (ns.hasRootAccess(server)) {
			if (
				await ns.scp("hackv2.js", server) &&
				await ns.scp("grow.js", server) &&
				await ns.scp("weaken.js", server) &&
				await ns.scp("init.js", server) &&
				await ns.scp("share.js", server) &&
				await ns.scp("hack.js", server)
			) {
				ns.print("Copied scripts to " + server);
				copyCount++;
			}
		}
	}
	ns.tprint(
		"Successfully copied scripts to " + copyCount + " servers."
	);
}